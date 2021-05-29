from motor.motor_asyncio import AsyncIOMotorClient
import os


class DataBase:
    client: AsyncIOMotorClient = None


db = DataBase()


async def get_database() -> AsyncIOMotorClient:
    db.client = AsyncIOMotorClient(os.environ.get('CONNECTION_STRING'))
    conn = db.client
    return conn['warehousedb']
