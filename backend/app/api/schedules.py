from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import date
from app.database import get_db
from app.schemas import schemas
from app.services import services
from fastapi.responses import StreamingResponse
from io import BytesIO
from openpyxl import Workbook

router = APIRouter(prefix="/schedule", tags=["schedule"])


@router.get("/", response_model=List[schemas.ScheduleAssignmentDetail])
def list_schedule(start_date: date, end_date: date, db: Session = Depends(get_db)):
    return services.list_schedule_assignments(db, start_date, end_date)


@router.post("/", response_model=schemas.ScheduleAssignment, status_code=201)
def create_schedule(
    assignment: schemas.ScheduleAssignmentCreate, db: Session = Depends(get_db)
):
    return services.create_schedule_assignment(db, assignment)


@router.put("/{assignment_id}", response_model=schemas.ScheduleAssignment)
def update_schedule(
    assignment_id: int,
    assignment: schemas.ScheduleAssignmentUpdate,
    db: Session = Depends(get_db),
):
    updated = services.update_schedule_assignment(db, assignment_id, assignment)
    if updated is None:
        raise HTTPException(status_code=404, detail="Assignment not found")
    return updated


@router.delete("/{assignment_id}", status_code=204)
def delete_schedule(assignment_id: int, db: Session = Depends(get_db)):
    success = services.delete_schedule_assignment(db, assignment_id)
    if not success:
        raise HTTPException(status_code=404, detail="Assignment not found")


@router.post("/generate", response_model=List[schemas.ScheduleAssignmentDetail])
def generate_schedule(
    request: schemas.ScheduleGenerateRequest, db: Session = Depends(get_db)
):
    return services.generate_schedule(db, request.start_date, request.days)


@router.get("/export")
def export_schedule(start_date: date, end_date: date, db: Session = Depends(get_db)):
    assignments = services.list_schedule_assignments(db, start_date, end_date)
    workbook = Workbook()
    sheet = workbook.active
    sheet.title = "Programacion"
    sheet.append(
        [
            "Fecha",
            "Rider",
            "Sucursal",
            "Marca",
            "Turno",
            "Inicio",
            "Fin",
            "Manual",
            "Notas",
        ]
    )
    for assignment in assignments:
        sheet.append(
            [
                assignment.shift_date.isoformat(),
                assignment.rider.full_name if assignment.rider else "",
                assignment.store.name if assignment.store else "",
                assignment.external_brand.name if assignment.external_brand else "",
                assignment.shift_type,
                assignment.start_time or "",
                assignment.end_time or "",
                "SI" if assignment.manual_override else "NO",
                assignment.notes or "",
            ]
        )
    output = BytesIO()
    workbook.save(output)
    output.seek(0)
    filename = f"programacion_{start_date.isoformat()}_{end_date.isoformat()}.xlsx"
    headers = {"Content-Disposition": f"attachment; filename={filename}"}
    return StreamingResponse(
        output,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers=headers,
    )
