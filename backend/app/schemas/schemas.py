from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date


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
    identification: Optional[str] = Field(None, description="Identification number")
    store_id: Optional[int] = Field(None, description="Assigned Panpaya store ID")
    observation: Optional[str] = Field(None, description="Observation or status notes")


class RiderCreate(RiderBase):
    pass


class RiderUpdate(BaseModel):
    full_name: Optional[str] = None
    active: Optional[bool] = None
    rider_type: Optional[str] = None
    identification: Optional[str] = None
    store_id: Optional[int] = None
    observation: Optional[str] = None


class Rider(RiderBase):
    id: int

    class Config:
        from_attributes = True


# External Brand schemas
class ExternalBrandBase(BaseModel):
    name: str = Field(..., description="External brand name")


class ExternalBrandCreate(ExternalBrandBase):
    pass


class ExternalBrandUpdate(BaseModel):
    name: Optional[str] = None


class ExternalBrand(ExternalBrandBase):
    id: int

    class Config:
        from_attributes = True


# Schedule schemas
class ScheduleAssignmentBase(BaseModel):
    rider_id: int = Field(..., description="Rider ID")
    store_id: Optional[int] = Field(None, description="Panpaya store ID")
    external_brand_id: Optional[int] = Field(None, description="External brand ID")
    shift_date: date = Field(..., description="Assignment date")
    shift_type: str = Field(..., description="Shift type (AM, PM, AM y PM, DESCANSO, DISPONIBLE, etc.)")
    start_time: Optional[str] = Field(None, description="Shift start time")
    end_time: Optional[str] = Field(None, description="Shift end time")
    manual_override: bool = Field(False, description="Manual override flag")
    notes: Optional[str] = Field(None, description="Assignment notes")


class ScheduleAssignmentCreate(ScheduleAssignmentBase):
    pass


class ScheduleAssignmentUpdate(BaseModel):
    store_id: Optional[int] = None
    external_brand_id: Optional[int] = None
    shift_type: Optional[str] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    manual_override: Optional[bool] = None
    notes: Optional[str] = None


class ScheduleAssignment(ScheduleAssignmentBase):
    id: int

    class Config:
        from_attributes = True


class ScheduleAssignmentDetail(ScheduleAssignment):
    rider: Optional[Rider] = None
    store: Optional[PanpayaStore] = None
    external_brand: Optional[ExternalBrand] = None


class ScheduleGenerateRequest(BaseModel):
    start_date: date
    days: int = Field(7, ge=1, le=31)


class ScheduleDashboardResponse(BaseModel):
    assignments: List[ScheduleAssignmentDetail]
    unassigned: List[int] = []
