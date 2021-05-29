from bson import ObjectId
from bson.errors import InvalidId

from models.model import ProductCreate, Product, User
from db.mongodb import AsyncIOMotorClient
from pydantic.error_wrappers import ValidationError

WAREHOUSE_COLLECTION = 'warehouse'


async def create_product(conn: AsyncIOMotorClient, product: ProductCreate) -> Product:
    obj = product.dict()
    result = await conn[WAREHOUSE_COLLECTION].insert_one(obj)
    obj['id'] = str(result.inserted_id)
    return Product.parse_obj(obj)


async def get_product_by_id(conn: AsyncIOMotorClient, id: str):
    try:
        newId = ObjectId(id)
        if str(newId) == id:
            product = await conn[WAREHOUSE_COLLECTION].find_one({'_id': ObjectId(id)})
            if product is None:
                return None
            product['id'] = str(product['_id'])
            return Product.parse_obj(product)
    except (InvalidId, ValidationError):
        return None


async def get_products_by_category(conn: AsyncIOMotorClient, id: str):
    try:
        newId = ObjectId(id)
        if str(newId) == id:
            product = await conn[WAREHOUSE_COLLECTION].find_one({'_id': ObjectId(id)})
            if product is None:
                return None
            product['id'] = str(product['_id'])
            return Product.parse_obj(product)
    except (InvalidId, ValidationError):
        return None


async def update_product(conn: AsyncIOMotorClient, product: Product) -> Product:
    obj = product.dict()
    obj_id = obj.pop('id', None)
    await conn[WAREHOUSE_COLLECTION].replace_one({'_id': ObjectId(obj_id)}, obj)
    product = await conn[WAREHOUSE_COLLECTION].find_one({'_id': ObjectId(product.id)})
    product['id'] = str(product['_id'])
    return Product.parse_obj(product)


async def find_product(conn: AsyncIOMotorClient, query=None):
    cursor = conn[WAREHOUSE_COLLECTION].find(query)
    ret = []
    for document in await cursor.to_list(length=100):
        document['id'] = str(document['_id'])
        ret.append(Product.parse_obj(document))

    return ret


async def delete_product(conn: AsyncIOMotorClient, product_id: str):
    return await conn[WAREHOUSE_COLLECTION].delete_one({'_id': ObjectId(product_id)})


def device_exists(product: Product, devid: str):
    for dev in product.quantity:
        if dev.devid == devid:
            return dev
    return None


def product_quantity(prod: Product):
    quantity = 0
    for dev in prod.quantity:
        quantity += dev.delta
    return quantity
