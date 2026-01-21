from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas import schemas
from app.services import services

router = APIRouter(prefix="/riders", tags=["riders"])


@router.get("/", response_model=List[schemas.Rider])
def list_riders(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    active_only: bool = Query(False),
    db: Session = Depends(get_db),
):
    """List all riders with optional active filter"""
    return services.get_riders(db, skip=skip, limit=limit, active_only=active_only)


@router.get("/{rider_id}", response_model=schemas.Rider)
def get_rider(rider_id: int, db: Session = Depends(get_db)):
    """Get a specific rider by ID"""
    db_rider = services.get_rider(db, rider_id)
    if db_rider is None:
        raise HTTPException(status_code=404, detail="Rider not found")
    return db_rider


@router.post("/", response_model=schemas.Rider, status_code=201)
def create_rider(rider: schemas.RiderCreate, db: Session = Depends(get_db)):
    """Create a new rider"""
    if rider.store_id is not None and rider.store_id <= 0:
        raise HTTPException(status_code=400, detail="Invalid store ID")
    if rider.store_id is not None and services.get_store(db, rider.store_id) is None:
        raise HTTPException(status_code=400, detail="Store not found")
    return services.create_rider(db, rider)


@router.put("/{rider_id}", response_model=schemas.Rider)
def update_rider(
    rider_id: int, rider: schemas.RiderUpdate, db: Session = Depends(get_db)
):
    """Update an existing rider"""
    if rider.store_id is not None and rider.store_id <= 0:
        raise HTTPException(status_code=400, detail="Invalid store ID")
    if rider.store_id is not None and services.get_store(db, rider.store_id) is None:
        raise HTTPException(status_code=400, detail="Store not found")
    db_rider = services.update_rider(db, rider_id, rider)
    if db_rider is None:
        raise HTTPException(status_code=404, detail="Rider not found")
    return db_rider


@router.delete("/{rider_id}", status_code=204)
def delete_rider(rider_id: int, db: Session = Depends(get_db)):
    """Delete a rider"""
    success = services.delete_rider(db, rider_id)
    if not success:
        raise HTTPException(status_code=404, detail="Rider not found")
