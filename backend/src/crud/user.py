from bson import ObjectId
from pydantic import EmailStr

from db.mongodb import AsyncIOMotorClient
from models.model import User, UserCreate

USER_COLLECTION = 'user'


async def create_user(conn: AsyncIOMotorClient, canto: User) -> User:
    obj = canto.dict()
    result = await conn[USER_COLLECTION].insert_one(obj)
    obj['id'] = str(result.inserted_id)
    return User.parse_obj(obj)


async def get_user_by_id(conn: object, id: object) -> object:
    user = await conn[USER_COLLECTION].find_one({'_id': ObjectId(id)})
    if user is None:
        return None
    user['id'] = str(user['_id'])
    return User.parse_obj(user)


async def get_user_by_email(conn: AsyncIOMotorClient, email: EmailStr) -> User:
    user = await conn[USER_COLLECTION].find_one({'email': email})
    if user is None:
        return None
    user['id'] = str(user['_id'])
    return User.parse_obj(user)


async def update_user(conn: AsyncIOMotorClient, canto: User) -> User:
    obj = canto.dict()
    await conn[USER_COLLECTION].replace_one({'_id': ObjectId(canto.id)}, obj)
    canto = await conn[USER_COLLECTION].find_one({'_id': ObjectId(canto.id)})
    canto['id'] = str(canto['_id'])
    return User.parse_obj(canto)
