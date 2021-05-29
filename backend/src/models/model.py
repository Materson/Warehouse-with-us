from __future__ import annotations

from typing import List, Optional, Any

from bson import ObjectId
from pydantic import BaseModel, EmailStr


class Info(BaseModel):
    version: str
    title: str


class AccessCode(BaseModel):
    access_code: str


class LoginData(BaseModel):
    email: EmailStr
    password: str


class AccessToken(BaseModel):
    access_token: str
    token_type: str = "bearer"


class DeviceQuantity(BaseModel):
    devid: str
    delta: int


class ProductCreate(BaseModel):
    manufacturer: str
    model: str
    price: float
    quantity: Optional[List[DeviceQuantity]] = []
    category: Optional[str] = None


class Product(ProductCreate):
    id: str


class ProductMove(BaseModel):
    id: str
    quantity: DeviceQuantity


class ProductRemove(BaseModel):
    id: str


class UserCreate(BaseModel):
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    password: str
    role: str


class BaseUser(BaseModel):
    id: str
    disabled: Optional[bool] = None
    email: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    role: str


class User(BaseUser):
    hashed_password: str


class TokenData(BaseModel):
    email: Optional[str] = None
    scopes: List[str] = []


class Response(BaseModel):
    product: List[Any]
    # api: Optional[ApiResponse] = None


class ResponseList(BaseModel):
    __root__: List[Response]


class VersionCreate(BaseModel):
    version: int


class Version(BaseModel):
    id: str
    version: int


class CategoryCreate(BaseModel):
    name: str


class Category(CategoryCreate):
    id: str


class CategoryRemove(BaseModel):
    id: str


class ApiResponse(BaseModel):
    code: int
    message: str
    quantity: Optional[int] = None
    product: Optional[Product] = None
