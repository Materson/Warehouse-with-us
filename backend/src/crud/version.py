from models.model import VersionCreate, Version
from db.mongodb import AsyncIOMotorClient

VERSION_COLLECTION = 'version'


async def create_version(conn: AsyncIOMotorClient, version: VersionCreate):
    obj = version.dict()
    result = await conn[VERSION_COLLECTION].insert_one(obj)
    obj['id'] = str(result.inserted_id)
    return Version.parse_obj(obj)


async def get_version(conn: AsyncIOMotorClient):
    cursor = conn[VERSION_COLLECTION].find()
    print("cursor" + str(cursor))
    version = None
    for document in await cursor.to_list(length=100):
        version = Version(id=str(document['_id']), version=document['version'])
    return version
