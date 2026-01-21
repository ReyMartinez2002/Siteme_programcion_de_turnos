from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from app.models.models import PanpayaStore, Rider, ExternalBrand, ScheduleAssignment
from app.schemas import schemas
from datetime import date, timedelta


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
        query = query.filter(Rider.active.is_(True))
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


# External brand services
def get_external_brand(db: Session, brand_id: int) -> Optional[ExternalBrand]:
    return db.query(ExternalBrand).filter(ExternalBrand.id == brand_id).first()


def get_external_brands(db: Session) -> List[ExternalBrand]:
    return db.query(ExternalBrand).order_by(ExternalBrand.name.asc()).all()


def create_external_brand(db: Session, brand: schemas.ExternalBrandCreate) -> ExternalBrand:
    db_brand = ExternalBrand(**brand.model_dump())
    db.add(db_brand)
    db.commit()
    db.refresh(db_brand)
    return db_brand


def update_external_brand(
    db: Session, brand_id: int, brand: schemas.ExternalBrandUpdate
) -> Optional[ExternalBrand]:
    db_brand = get_external_brand(db, brand_id)
    if db_brand is None:
        return None
    update_data = brand.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_brand, field, value)
    db.commit()
    db.refresh(db_brand)
    return db_brand


def delete_external_brand(db: Session, brand_id: int) -> bool:
    db_brand = get_external_brand(db, brand_id)
    if db_brand is None:
        return False
    db.delete(db_brand)
    db.commit()
    return True


# Schedule services
def list_schedule_assignments(
    db: Session, start_date: date, end_date: date
) -> List[ScheduleAssignment]:
    return (
        db.query(ScheduleAssignment)
        .options(
            joinedload(ScheduleAssignment.rider),
            joinedload(ScheduleAssignment.store),
            joinedload(ScheduleAssignment.external_brand),
        )
        .filter(ScheduleAssignment.shift_date >= start_date)
        .filter(ScheduleAssignment.shift_date <= end_date)
        .order_by(ScheduleAssignment.shift_date.asc())
        .all()
    )


def create_schedule_assignment(
    db: Session, assignment: schemas.ScheduleAssignmentCreate
) -> ScheduleAssignment:
    db_assignment = ScheduleAssignment(**assignment.model_dump())
    db.add(db_assignment)
    db.commit()
    db.refresh(db_assignment)
    return db_assignment


def update_schedule_assignment(
    db: Session, assignment_id: int, assignment: schemas.ScheduleAssignmentUpdate
) -> Optional[ScheduleAssignment]:
    db_assignment = (
        db.query(ScheduleAssignment)
        .filter(ScheduleAssignment.id == assignment_id)
        .first()
    )
    if db_assignment is None:
        return None
    update_data = assignment.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_assignment, field, value)
    db.commit()
    db.refresh(db_assignment)
    return db_assignment


def delete_schedule_assignment(db: Session, assignment_id: int) -> bool:
    db_assignment = (
        db.query(ScheduleAssignment)
        .filter(ScheduleAssignment.id == assignment_id)
        .first()
    )
    if db_assignment is None:
        return False
    db.delete(db_assignment)
    db.commit()
    return True


def generate_schedule(db: Session, start_date: date, days: int) -> List[ScheduleAssignment]:
    riders = db.query(Rider).filter(Rider.active.is_(True)).all()
    stores = db.query(PanpayaStore).all()
    external_brands = db.query(ExternalBrand).order_by(ExternalBrand.name.asc()).all()
    if not riders:
        return []
    assignments: List[ScheduleAssignment] = []
    schedule_dates = [start_date + timedelta(days=offset) for offset in range(days)]
    ppy_riders = [r for r in riders if r.rider_type.upper() == "PANPAYA"]
    tc_riders = [r for r in riders if r.rider_type.upper() in ("TC", "TIEMPO_COMPLETO")]
    fds_riders = [r for r in riders if r.rider_type.upper() in ("FDS", "FIN_DE_SEMANA")]
    if not tc_riders:
        tc_riders = [r for r in riders if r.rider_type.upper() == "EXTERNO"]
    counters = {r.id: {"am": 0, "pm": 0, "double": 0, "rest": 0} for r in riders}
    per_day_pool: dict[date, List[Rider]] = {}
    existing_manual = (
        db.query(ScheduleAssignment)
        .filter(ScheduleAssignment.manual_override.is_(True))
        .filter(ScheduleAssignment.shift_date >= start_date)
        .filter(ScheduleAssignment.shift_date < start_date + timedelta(days=days))
        .all()
    )
    manual_pairs = {(item.shift_date, item.rider_id) for item in existing_manual}
    for shift_date in schedule_dates:
        day_index = shift_date.weekday()
        for store in stores:
            store_riders = [r for r in ppy_riders if r.store_id == store.id]
            if not store_riders:
                continue
            eligible = [r for r in store_riders if not _is_exception(r)]
            if not eligible:
                continue
            if day_index % 2 == 0:
                am_rider = min(eligible, key=lambda r: counters[r.id]["am"])
                pm_rider = min(eligible, key=lambda r: counters[r.id]["pm"])
                if am_rider.id == pm_rider.id:
                    if (shift_date, am_rider.id) in manual_pairs:
                        continue
                    assignments.append(
                        ScheduleAssignment(
                            rider_id=am_rider.id,
                            store_id=store.id,
                            shift_date=shift_date,
                            shift_type="AM Y PM",
                        )
                    )
                    counters[am_rider.id]["double"] += 1
                else:
                    if (shift_date, am_rider.id) not in manual_pairs:
                        assignments.append(
                            ScheduleAssignment(
                                rider_id=am_rider.id,
                                store_id=store.id,
                                shift_date=shift_date,
                                shift_type="AM",
                            )
                        )
                        counters[am_rider.id]["am"] += 1
                    if (shift_date, pm_rider.id) not in manual_pairs:
                        assignments.append(
                            ScheduleAssignment(
                                rider_id=pm_rider.id,
                                store_id=store.id,
                                shift_date=shift_date,
                                shift_type="PM",
                            )
                        )
                        counters[pm_rider.id]["pm"] += 1
            else:
                rest_rider = min(eligible, key=lambda r: counters[r.id]["rest"])
                if (shift_date, rest_rider.id) not in manual_pairs:
                    assignments.append(
                        ScheduleAssignment(
                            rider_id=rest_rider.id,
                            store_id=store.id,
                            shift_date=shift_date,
                            shift_type="DESCANSO",
                        )
                    )
                    counters[rest_rider.id]["rest"] += 1
                active_riders = [r for r in eligible if r.id != rest_rider.id]
                if active_riders:
                    am_rider = min(active_riders, key=lambda r: counters[r.id]["am"])
                    pm_rider = min(active_riders, key=lambda r: counters[r.id]["pm"])
                    if am_rider.id == pm_rider.id:
                        if (shift_date, am_rider.id) in manual_pairs:
                            continue
                        assignments.append(
                            ScheduleAssignment(
                                rider_id=am_rider.id,
                                store_id=store.id,
                                shift_date=shift_date,
                                shift_type="AM Y PM",
                            )
                        )
                        counters[am_rider.id]["double"] += 1
                    else:
                        if (shift_date, am_rider.id) not in manual_pairs:
                            assignments.append(
                                ScheduleAssignment(
                                    rider_id=am_rider.id,
                                    store_id=store.id,
                                    shift_date=shift_date,
                                    shift_type="AM",
                                )
                            )
                            counters[am_rider.id]["am"] += 1
                        if (shift_date, pm_rider.id) not in manual_pairs:
                            assignments.append(
                                ScheduleAssignment(
                                    rider_id=pm_rider.id,
                                    store_id=store.id,
                                    shift_date=shift_date,
                                    shift_type="PM",
                                )
                            )
                            counters[pm_rider.id]["pm"] += 1
        pool = per_day_pool.get(shift_date)
        if pool is None:
            pool = tc_riders + fds_riders
            per_day_pool[shift_date] = pool
        assigned_external = set()
        for brand in external_brands:
            available_riders = [
                r
                for r in pool
                if r.id not in assigned_external
                and not _is_exception(r)
                and (shift_date, r.id) not in manual_pairs
                and not (r in fds_riders and day_index < 5)
            ]
            if not available_riders:
                break
            rider = available_riders[0]
            assigned_external.add(rider.id)
            assignments.append(
                ScheduleAssignment(
                    rider_id=rider.id,
                    external_brand_id=brand.id,
                    shift_date=shift_date,
                    shift_type="EXTERNO",
                )
            )
            counters[rider.id]["am"] += 1
            pool.append(pool.pop(pool.index(rider)))
        for rider in pool:
            if _is_exception(rider):
                continue
            if rider in fds_riders and day_index < 5:
                continue
            if rider.id in assigned_external:
                continue
            if (shift_date, rider.id) in manual_pairs:
                continue
            assignments.append(
                ScheduleAssignment(
                    rider_id=rider.id,
                    shift_date=shift_date,
                    shift_type="DISPONIBLE",
                )
            )
    db.query(ScheduleAssignment).filter(
        ScheduleAssignment.shift_date >= start_date,
        ScheduleAssignment.shift_date < start_date + timedelta(days=days),
        ScheduleAssignment.manual_override.is_(False),
    ).delete(synchronize_session=False)
    for assignment in assignments:
        db.add(assignment)
    db.commit()
    return list_schedule_assignments(
        db, start_date, start_date + timedelta(days=days - 1)
    )


def _is_exception(rider: Rider) -> bool:
    if not rider.observation:
        return False
    observation = rider.observation.upper()
    keywords = ["VACACIONES", "INCAPACIDAD", "LICENCIA", "PERMISO"]
    return any(keyword in observation for keyword in keywords)
