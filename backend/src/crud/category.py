from bson import ObjectId
from bson.errors import InvalidId

from models.model import CategoryCreate, Category, User
from db.mongodb import AsyncIOMotorClient
from pydantic.error_wrappers import ValidationError

CATEGORY_COLLECTION = 'category'


async def create_category(conn: AsyncIOMotorClient, category: CategoryCreate) -> Category:
    obj = category.dict()
    categ = await get_category_by_name(conn, obj['name'])
    if categ is not None:
        # Category exist - return existing category
        return categ

    result = await conn[CATEGORY_COLLECTION].insert_one(obj)
    obj['id'] = str(result.inserted_id)
    return Category.parse_obj(obj)


async def get_category_by_id(conn: AsyncIOMotorClient, id: str):
    try:
        newId = ObjectId(id)
        if str(newId) == id:
            category = await conn[CATEGORY_COLLECTION].find_one({'_id': ObjectId(id)})
            if category is None:
                return None
            category['id'] = str(category['_id'])
            return Category.parse_obj(category)
    except (InvalidId, ValidationError):
        return None


async def get_category_by_name(conn: AsyncIOMotorClient, name: str):
    category = await conn[CATEGORY_COLLECTION].find_one({'name': name})
    if category is None:
        return None
    category['id'] = str(category['_id'])
    return Category.parse_obj(category)


async def update_category(conn: AsyncIOMotorClient, category: Category) -> Category:
    obj = category.dict()
    obj_id = obj.pop('id', None)
    await conn[CATEGORY_COLLECTION].replace_one({'_id': ObjectId(obj_id)}, obj)
    category = await conn[CATEGORY_COLLECTION].find_one({'_id': ObjectId(category.id)})
    category['id'] = str(category['_id'])
    return Category.parse_obj(category)


async def find_category(conn: AsyncIOMotorClient, query=None):
    cursor = conn[CATEGORY_COLLECTION].find()
    ret = []
    for document in await cursor.to_list(length=100):
        document['id'] = str(document['_id'])
        ret.append(document)

    return ret


async def delete_category(conn: AsyncIOMotorClient, category_id: str):
    return await conn[CATEGORY_COLLECTION].delete_one({'_id': ObjectId(category_id)})