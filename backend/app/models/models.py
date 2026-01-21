from sqlalchemy import Column, Integer, String, Boolean, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class PanpayaStore(Base):
    """Panpaya branch/store model"""
    __tablename__ = "panpaya_stores"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    zone = Column(String, nullable=True)
    address = Column(String, nullable=True)


class Rider(Base):
    """Delivery rider (domiciliario) model"""
    __tablename__ = "riders"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    active = Column(Boolean, default=True, nullable=False)
    rider_type = Column(String, nullable=False)  # e.g., "PANPAYA", "EXTERNO", etc.
    identification = Column(String, nullable=True)
    store_id = Column(Integer, ForeignKey("panpaya_stores.id"), nullable=True)
    observation = Column(String, nullable=True)

    store = relationship("PanpayaStore")


class ExternalBrand(Base):
    """External brand that can be covered by TC/FDS riders"""
    __tablename__ = "external_brands"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)


class ScheduleAssignment(Base):
    """Daily assignment for a rider"""
    __tablename__ = "schedule_assignments"

    id = Column(Integer, primary_key=True, index=True)
    rider_id = Column(Integer, ForeignKey("riders.id"), nullable=False)
    store_id = Column(Integer, ForeignKey("panpaya_stores.id"), nullable=True)
    external_brand_id = Column(Integer, ForeignKey("external_brands.id"), nullable=True)
    shift_date = Column(Date, nullable=False, index=True)
    shift_type = Column(String, nullable=False)
    start_time = Column(String, nullable=True)
    end_time = Column(String, nullable=True)
    manual_override = Column(Boolean, default=False, nullable=False)
    notes = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    rider = relationship("Rider")
    store = relationship("PanpayaStore")
    external_brand = relationship("ExternalBrand")
