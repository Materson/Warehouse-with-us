from fastapi import APIRouter, Depends

from models.model import VersionCreate, Version
from db.mongodb import get_database
from crud.version import get_version, create_version
from motor.motor_asyncio import AsyncIOMotorClient
from settings import DB_VERSION

router = APIRouter()


@router.get("/", status_code=200)
async def api_version(conn: AsyncIOMotorClient = Depends(get_database)):
    version = await get_version(conn)
    print("api" + str(version))
    if version is None:
        version = await create_version(conn, VersionCreate(version=DB_VERSION))
    return version
