from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from starlette.status import HTTP_401_UNAUTHORIZED

from crud.user import create_user
from db.mongodb import get_database
from models.model import ApiResponse, User, LoginData, \
    AccessToken, UserCreate
from settings import ACCESS_TOKEN_EXPIRE_MINUTES
from utils.auth import get_current_active_user, get_password_hash, authenticate_user, create_access_token

router = APIRouter()


@router.post("/register", response_model=User, response_model_exclude=["hashed_password"], tags=['auth'])
async def user_register(user_data: UserCreate, conn: AsyncIOMotorClient = Depends(get_database)) -> User:
    new_user = User(
        id="",
        email=user_data.email,
        hashed_password=get_password_hash(user_data.password),
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        role=user_data.role)
    return await create_user(conn, new_user)


@router.post("/token", response_model=AccessToken, tags=['auth'])
async def logs_user_into_the_system(
        login_data: LoginData,
        conn: AsyncIOMotorClient = Depends(get_database)) -> AccessToken:
    user_data = await authenticate_user(conn, login_data.email, login_data.password)
    if not user_data:
        raise HTTPException(
            status_code=HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    access_token = create_access_token(
        data={"sub": user_data.email, "scopes": [user_data.role]}, expires_delta=access_token_expires
    )
    return AccessToken(access_token=access_token)


@router.get("/refresh_token", response_model=AccessToken, tags=['auth'])
async def refresh_oath_token(user_data: User = Depends(get_current_active_user)) -> AccessToken:
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    access_token = create_access_token(
        data={"sub": user_data.email}, expires_delta=access_token_expires
    )
    return AccessToken(access_token=access_token)
