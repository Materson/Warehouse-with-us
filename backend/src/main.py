from fastapi import FastAPI, Depends

from routers import user, product, auth, version, category
from utils.auth import get_current_active_user
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "https://localhost",
    "https://localhost:3002",
    "https://192.168.43.54:3002",
    "https://elf:3002",
    "https://elf"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def read_root():
    return {"Hello": "World"}

app.include_router(auth.router, prefix="/auth")
app.include_router(version.router, prefix="/version")
app.include_router(user.router, prefix="/user", dependencies=[Depends(get_current_active_user)])
app.include_router(category.router, prefix="/category", dependencies=[Depends(get_current_active_user)])
app.include_router(product.router, prefix="/product", dependencies=[Depends(get_current_active_user)])
