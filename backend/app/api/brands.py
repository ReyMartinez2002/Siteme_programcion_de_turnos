from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas import schemas
from app.services import services
from app.models.models import ExternalBrand

router = APIRouter(prefix="/brands", tags=["brands"])


@router.get("/", response_model=List[schemas.ExternalBrand])
def list_brands(db: Session = Depends(get_db)):
    return services.get_external_brands(db)


@router.post("/", response_model=schemas.ExternalBrand, status_code=201)
def create_brand(brand: schemas.ExternalBrandCreate, db: Session = Depends(get_db)):
    existing = db.query(ExternalBrand).filter(ExternalBrand.name == brand.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Brand already exists")
    return services.create_external_brand(db, brand)


@router.put("/{brand_id}", response_model=schemas.ExternalBrand)
def update_brand(
    brand_id: int, brand: schemas.ExternalBrandUpdate, db: Session = Depends(get_db)
):
    if brand.name:
        existing = (
            db.query(ExternalBrand)
            .filter(ExternalBrand.name == brand.name, ExternalBrand.id != brand_id)
            .first()
        )
        if existing:
            raise HTTPException(status_code=400, detail="Brand already exists")
    db_brand = services.update_external_brand(db, brand_id, brand)
    if db_brand is None:
        raise HTTPException(status_code=404, detail="Brand not found")
    return db_brand


@router.delete("/{brand_id}", status_code=204)
def delete_brand(brand_id: int, db: Session = Depends(get_db)):
    success = services.delete_external_brand(db, brand_id)
    if not success:
        raise HTTPException(status_code=404, detail="Brand not found")
