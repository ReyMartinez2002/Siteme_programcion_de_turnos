from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas import schemas
from app.services import services

router = APIRouter(prefix="/stores", tags=["stores"])


@router.get("/", response_model=List[schemas.PanpayaStore])
def list_stores(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """List all Panpaya stores"""
    return services.get_stores(db, skip=skip, limit=limit)


@router.get("/{store_id}", response_model=schemas.PanpayaStore)
def get_store(store_id: int, db: Session = Depends(get_db)):
    """Get a specific store by ID"""
    db_store = services.get_store(db, store_id)
    if db_store is None:
        raise HTTPException(status_code=404, detail="Store not found")
    return db_store


@router.post("/", response_model=schemas.PanpayaStore, status_code=201)
def create_store(store: schemas.PanpayaStoreCreate, db: Session = Depends(get_db)):
    """Create a new Panpaya store"""
    # Check if store with same code already exists
    db_store = services.get_store_by_code(db, store.code)
    if db_store:
        raise HTTPException(
            status_code=400, detail="Store with this code already exists"
        )
    return services.create_store(db, store)


@router.put("/{store_id}", response_model=schemas.PanpayaStore)
def update_store(
    store_id: int, store: schemas.PanpayaStoreUpdate, db: Session = Depends(get_db)
):
    """Update an existing store"""
    # If updating code, check it doesn't conflict with another store
    if store.code is not None:
        existing = services.get_store_by_code(db, store.code)
        if existing and existing.id != store_id:
            raise HTTPException(
                status_code=400, detail="Store with this code already exists"
            )
    
    db_store = services.update_store(db, store_id, store)
    if db_store is None:
        raise HTTPException(status_code=404, detail="Store not found")
    return db_store


@router.delete("/{store_id}", status_code=204)
def delete_store(store_id: int, db: Session = Depends(get_db)):
    """Delete a store"""
    success = services.delete_store(db, store_id)
    if not success:
        raise HTTPException(status_code=404, detail="Store not found")
