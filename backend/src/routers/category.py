from typing import List

from fastapi import APIRouter, Depends, Security
from motor.motor_asyncio import AsyncIOMotorClient

from crud.category import create_category, update_category, get_category_by_id, find_category, delete_category, \
    get_category_by_name
from crud.product import find_product, update_product
from db.mongodb import get_database
from models.model import Category, CategoryCreate, CategoryRemove, User, ApiResponse, Response, ResponseList
from utils.auth import get_current_active_user, get_current_user

router = APIRouter()


@router.post("/", tags=["category"])
async def define_new_category(categories: List[CategoryCreate], conn: AsyncIOMotorClient = Depends(get_database)):
    # category.quantity = 0
    createdCategories = []
    for category in categories:
        categ = await create_category(conn, category)
        # obj = Response(category=prod)
        createdCategories.append(categ)
    return createdCategories


@router.put("/", tags=["category"])
async def update_categ(categories: List[Category], conn: AsyncIOMotorClient = Depends(get_database)):
    updatedCategories = []
    for category in categories:
        categ = await get_category_by_id(conn, category.id)
        if categ is None:
            updatedCategories.append(ApiResponse(code=404, message="Category not found"))
            continue

        categ = await update_category(conn, Category.parse_obj(category))
        updatedCategories.append(categ)
    return updatedCategories


@router.delete("/", tags=["category"])
async def remove_category(categories: List[CategoryRemove], conn: AsyncIOMotorClient = Depends(get_database),
                         user: User = Security(get_current_active_user, scopes=["manager"])):
    deletedCategory = []
    for category in categories:
        categ = await get_category_by_id(conn, category.id)
        if categ is None:
            deletedCategory.append(ApiResponse(code=404, message="Category not found"))
            continue

        # Products with category - change to default
        products = await find_product(conn, {'category': category.id})
        default_category = await get_category_by_name(conn, '-')
        for product in products:
            product.category = default_category.id
            await update_product(conn, product)

        # Delete category
        res = await delete_category(conn, categ.id)
        if res.deleted_count:
            deletedCategory.append(ApiResponse(code=200, message="Category removed"))
            continue
        else:
            deletedCategory.append(ApiResponse(code=500, message="An error occurred while deleting"))
            continue
    return deletedCategory


@router.get("/", response_model=List[Category], tags=["category"])
async def search_category(conn: AsyncIOMotorClient = Depends(get_database)) -> List[Category]:
    return await find_category(conn)


@router.get("/{category_id}", tags=["category"], status_code=200)
async def get_category(category_id, conn: AsyncIOMotorClient = Depends(get_database)):
    result = await get_category_by_id(conn, category_id)
    if result is not None:
        return result
    else:
        return ApiResponse(code=404, message='No such category')


