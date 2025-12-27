from pydantic import BaseModel, Field
from typing import Optional


# Panpaya Store schemas
class PanpayaStoreBase(BaseModel):
    code: str = Field(..., description="Unique code for the store")
    name: str = Field(..., description="Name of the store")
    zone: Optional[str] = Field(None, description="Zone where the store is located")
    address: Optional[str] = Field(None, description="Physical address of the store")


class PanpayaStoreCreate(PanpayaStoreBase):
    pass


class PanpayaStoreUpdate(BaseModel):
    code: Optional[str] = None
    name: Optional[str] = None
    zone: Optional[str] = None
    address: Optional[str] = None


class PanpayaStore(PanpayaStoreBase):
    id: int

    class Config:
        from_attributes = True


# Rider schemas
class RiderBase(BaseModel):
    full_name: str = Field(..., description="Full name of the rider")
    active: bool = Field(True, description="Whether the rider is active")
    rider_type: str = Field(..., description="Type of rider (PANPAYA, EXTERNO, etc.)")


class RiderCreate(RiderBase):
    pass


class RiderUpdate(BaseModel):
    full_name: Optional[str] = None
    active: Optional[bool] = None
    rider_type: Optional[str] = None


class Rider(RiderBase):
    id: int

    class Config:
        from_attributes = True
