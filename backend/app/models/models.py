from sqlalchemy import Column, Integer, String, Boolean
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
