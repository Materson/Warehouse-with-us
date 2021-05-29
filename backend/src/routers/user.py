from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from motor.motor_asyncio import AsyncIOMotorClient

from db.mongodb import get_database
from models.model import User, UserCreate, BaseUser
from utils.auth import get_current_active_user, get_password_hash
from models.model import ApiResponse

router = APIRouter()


@router.get("", response_model=BaseUser, tags=['user'])
async def get_user_data(user_data: User = Depends(get_current_active_user)) -> BaseUser:
    return user_data
