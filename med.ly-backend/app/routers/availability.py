from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from .. import models, schemas, database
from .auth import get_current_doctor

router = APIRouter(
    prefix="/availability",
    tags=["availability"],
    responses={404: {"description": "Not found"}},
)

@router.post("/", response_model=schemas.DoctorAvailabilitySlotResponse, status_code=status.HTTP_201_CREATED)
def create_availability_slot(
    slot: schemas.DoctorAvailabilitySlotCreate,
    db: Session = Depends(database.get_db),
    current_doctor: models.Doctor = Depends(get_current_doctor)
):
    """Médico cria um slot de disponibilidade para um exame"""
    
    # Verificar se o exame existe
    exam = db.query(models.Exam).filter(models.Exam.id == slot.exam_id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Exame não encontrado")
    
    # Criar slot de disponibilidade
    db_slot = models.DoctorAvailabilitySlot(
        doctor_id=current_doctor.id,
        exam_id=slot.exam_id,
        date=slot.date,
        start_time=slot.start_time,
        end_time=slot.end_time,
        is_available=True,
        created_at=datetime.utcnow()
    )
    
    db.add(db_slot)
    db.commit()
    db.refresh(db_slot)
    return db_slot

@router.get("/my-slots", response_model=List[schemas.DoctorAvailabilitySlotResponse])
def get_my_availability_slots(
    db: Session = Depends(database.get_db),
    current_doctor: models.Doctor = Depends(get_current_doctor)
):
    """Médico visualiza seus próprios slots de disponibilidade"""
    
    slots = db.query(models.DoctorAvailabilitySlot)\
        .filter(models.DoctorAvailabilitySlot.doctor_id == current_doctor.id)\
        .all()
    
    return slots

@router.delete("/{slot_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_availability_slot(
    slot_id: int,
    db: Session = Depends(database.get_db),
    current_doctor: models.Doctor = Depends(get_current_doctor)
):
    """Médico remove um slot de disponibilidade"""
    
    slot = db.query(models.DoctorAvailabilitySlot)\
        .filter(
            models.DoctorAvailabilitySlot.id == slot_id,
            models.DoctorAvailabilitySlot.doctor_id == current_doctor.id
        ).first()
    
    if not slot:
        raise HTTPException(status_code=404, detail="Slot não encontrado")
    
    # Verificar se há agendamento para este slot
    appointment = db.query(models.Appointment)\
        .filter(models.Appointment.availability_slot_id == slot_id).first()
    
    if appointment:
        raise HTTPException(
            status_code=400, 
            detail="Não é possível remover um slot que já possui agendamento"
        )
    
    db.delete(slot)
    db.commit()
    return None