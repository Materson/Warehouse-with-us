from typing import List

from fastapi import APIRouter, Depends, Security
from motor.motor_asyncio import AsyncIOMotorClient

from crud.product import create_product, update_product, get_product_by_id, find_product, delete_product, device_exists,\
    product_quantity
from crud.category import get_category_by_name, create_category, get_category_by_id
from db.mongodb import get_database
from models.model import Product, ProductCreate, ProductRemove, ProductMove, User, ApiResponse, Response, ResponseList, \
    CategoryCreate
from utils.auth import get_current_active_user, get_current_user

router = APIRouter()


@router.post("/", tags=["product"])
async def define_new_product(products: List[ProductCreate], conn: AsyncIOMotorClient = Depends(get_database)):
    # product.quantity = 0
    createdProducts = []
    for product in products:
        categ_deleted = False
        # Category
        default_category = await get_category_by_name(conn, "-")
        if product.category is None:
            # Category not defined - set default category
            product.category = default_category.id
        else:
            # Category defined
            categ = await get_category_by_id(conn, product.category)
            if categ is None:
                # Category was deleted - set default category
                # new_categ = await create_category(conn, CategoryCreate(name=product.category))
                categ_deleted = True
                product.category = default_category.id

        # Create product
        prod = await create_product(conn, product)
        if categ_deleted:
            createdProducts.append(ApiResponse(code=200, message="Change category to default", product=prod))
        else:
            createdProducts.append(prod)
    return createdProducts


@router.put("/", tags=["product"])
async def update_prod(products: List[Product], conn: AsyncIOMotorClient = Depends(get_database)):
    updatedProducts = []
    for product in products:
        prod = await get_product_by_id(conn, product.id)
        if prod is None:
            updatedProducts.append(ApiResponse(code=404, message="Product not found"))
            continue

        categ = await get_category_by_id(conn, product.category)
        if categ is None:
            default_category = await get_category_by_name(conn, "-")
            product.category = default_category.id
        else:
            product.category = categ.id

        old = prod.dict()
        product.quantity = old['quantity']
        prod = await update_product(conn, Product.parse_obj(product))
        updatedProducts.append(prod)
    return updatedProducts


@router.delete("/delete", tags=["product"])
async def remove_product(products: List[ProductRemove], conn: AsyncIOMotorClient = Depends(get_database),
                         user: User = Security(get_current_active_user, scopes=["manager"])):
    deletedProduct = []
    for product in products:
        prod = await get_product_by_id(conn, product.id)
        if prod is None:
            deletedProduct.append(ApiResponse(code=404, message="Product not found"))
            continue
        res = await delete_product(conn, prod.id)
        if res.deleted_count:
            deletedProduct.append(ApiResponse(code=200, message="Product removed"))
            continue
        else:
            deletedProduct.append(ApiResponse(code=500, message="An error occurred while deleting"))
            continue
    return deletedProduct


# @router.put("/supply", tags=["product"])
# async def supply_product(product: ProductMove, conn: AsyncIOMotorClient = Depends(get_database)):
#     prod = await get_product_by_id(conn, product.id)
#     if prod is None:
#         return ApiResponse(code=404, message="Product not found")
#     new_prod = prod.dict()
#     new_prod['quantity'] = new_prod['quantity'] + abs(product.quantity)
#     return await update_product(conn, Product.parse_obj(new_prod))


@router.put("/move", tags=["product"])
async def move_product(products: List[ProductMove], conn: AsyncIOMotorClient = Depends(get_database)):
    moveProduct = []
    for product in products:
        prod = await get_product_by_id(conn, product.id)
        if prod is None:
            moveProduct.append(ApiResponse(code=404, message="Product not found"))
            continue

        device = device_exists(prod, product.quantity.devid)
        if device is not None:
            delta = -device.delta + product.quantity.delta
            returnquantity = device.delta
        else:
            delta = product.quantity.delta
            returnquantity = 0

        old_quantity = product_quantity(prod)
        print("delta:" + str(delta))
        if old_quantity + delta < 0:
            moveProduct.append(ApiResponse(code=405, message="Too many to reduce", quantity=returnquantity))
            continue

        # if new_prod['quantity'] + product.quantity < 0:
        #     return ApiResponse(code=405, message="Too many to reduce")
        new_prod = prod.dict()
        if device is not None:
            for dev in new_prod['quantity']:
                if dev['devid'] == product.quantity.devid:
                    dev['delta'] = product.quantity.delta
        else:
            new_prod['quantity'].append(product.quantity)

        # new_prod['quantity'] = new_prod['quantity'] + product.quantity
        upProd = await update_product(conn, Product.parse_obj(new_prod))
        moveProduct.append(upProd)
    return moveProduct


@router.get("/", response_model=List[Product], tags=["product"])
async def search_product(conn: AsyncIOMotorClient = Depends(get_database)) -> List[Product]:
    return await find_product(conn)


@router.get("/{product_id}", tags=["product"], status_code=200)
async def get_product(product_id, conn: AsyncIOMotorClient = Depends(get_database)):
    result = await get_product_by_id(conn, product_id)
    if result is not None:
        return result
    else:
        return ApiResponse(code=404, message='No such product')


