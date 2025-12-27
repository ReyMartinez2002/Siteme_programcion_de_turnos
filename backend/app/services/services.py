from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.models import PanpayaStore, Rider
from app.schemas import schemas


# Panpaya Store services
def get_store(db: Session, store_id: int) -> Optional[PanpayaStore]:
    """Get a single store by ID"""
    return db.query(PanpayaStore).filter(PanpayaStore.id == store_id).first()


def get_store_by_code(db: Session, code: str) -> Optional[PanpayaStore]:
    """Get a single store by code"""
    return db.query(PanpayaStore).filter(PanpayaStore.code == code).first()


def get_stores(db: Session, skip: int = 0, limit: int = 100) -> List[PanpayaStore]:
    """Get all stores with pagination"""
    return db.query(PanpayaStore).offset(skip).limit(limit).all()


def create_store(db: Session, store: schemas.PanpayaStoreCreate) -> PanpayaStore:
    """Create a new store"""
    db_store = PanpayaStore(**store.model_dump())
    db.add(db_store)
    db.commit()
    db.refresh(db_store)
    return db_store


def update_store(
    db: Session, store_id: int, store: schemas.PanpayaStoreUpdate
) -> Optional[PanpayaStore]:
    """Update an existing store"""
    db_store = get_store(db, store_id)
    if db_store is None:
        return None
    
    update_data = store.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_store, field, value)
    
    db.commit()
    db.refresh(db_store)
    return db_store


def delete_store(db: Session, store_id: int) -> bool:
    """Delete a store"""
    db_store = get_store(db, store_id)
    if db_store is None:
        return False
    
    db.delete(db_store)
    db.commit()
    return True


# Rider services
def get_rider(db: Session, rider_id: int) -> Optional[Rider]:
    """Get a single rider by ID"""
    return db.query(Rider).filter(Rider.id == rider_id).first()


def get_riders(
    db: Session, skip: int = 0, limit: int = 100, active_only: bool = False
) -> List[Rider]:
    """Get all riders with pagination and optional active filter"""
    query = db.query(Rider)
    if active_only:
        query = query.filter(Rider.active == True)
    return query.offset(skip).limit(limit).all()


def create_rider(db: Session, rider: schemas.RiderCreate) -> Rider:
    """Create a new rider"""
    db_rider = Rider(**rider.model_dump())
    db.add(db_rider)
    db.commit()
    db.refresh(db_rider)
    return db_rider


def update_rider(
    db: Session, rider_id: int, rider: schemas.RiderUpdate
) -> Optional[Rider]:
    """Update an existing rider"""
    db_rider = get_rider(db, rider_id)
    if db_rider is None:
        return None
    
    update_data = rider.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_rider, field, value)
    
    db.commit()
    db.refresh(db_rider)
    return db_rider


def delete_rider(db: Session, rider_id: int) -> bool:
    """Delete a rider"""
    db_rider = get_rider(db, rider_id)
    if db_rider is None:
        return False
    
    db.delete(db_rider)
    db.commit()
    return True
