from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta

from .. import models, schemas, database
from .auth import get_current_user, get_current_patient, get_current_doctor

router = APIRouter(
    prefix="/appointments",
    tags=["appointments"],
    responses={404: {"description": "Not found"}},
)

@router.post("/", response_model=schemas.AppointmentResponse, status_code=status.HTTP_201_CREATED)
def create_appointment(
    appointment: schemas.AppointmentCreate,
    db: Session = Depends(database.get_db),
    current_patient: models.Patient = Depends(get_current_patient)
):
    """Paciente cria um agendamento escolhendo um slot disponível"""
    
    # Verificar se o slot existe e está disponível
    slot = db.query(models.DoctorAvailabilitySlot)\
        .filter(
            models.DoctorAvailabilitySlot.id == appointment.availability_slot_id,
            models.DoctorAvailabilitySlot.is_available == True
        ).first()
    
    if not slot:
        raise HTTPException(
            status_code=404, 
            detail="Slot não encontrado ou não está mais disponível"
        )
    
    # Criar o agendamento
    appointment_datetime = datetime.combine(slot.date, slot.start_time)
    
    db_appointment = models.Appointment(
        patient_id=current_patient.id,
        doctor_id=slot.doctor_id,
        exam_id=slot.exam_id,
        availability_slot_id=slot.id,
        date_time=appointment_datetime,
        status="scheduled",
        notes=appointment.notes,
        created_at=datetime.utcnow()
    )
    
    # Marcar o slot como indisponível
    slot.is_available = False
    
    db.add(db_appointment)
    db.commit()
    db.refresh(db_appointment)
    return db_appointment

@router.get("/my-appointments", response_model=List[schemas.AppointmentWithDetails])
def get_my_appointments(
    db: Session = Depends(database.get_db),
    current_user: dict = Depends(get_current_user)
):
    """Usuário visualiza seus próprios agendamentos"""
    
    user = current_user["user"]
    user_type = current_user["user_type"]
    
    if user_type == "patient":
        appointments = db.query(models.Appointment)\
            .filter(models.Appointment.patient_id == user.id)\
            .join(models.Doctor)\
            .join(models.Exam)\
            .join(models.DoctorAvailabilitySlot)\
            .all()
    elif user_type == "doctor":
        appointments = db.query(models.Appointment)\
            .filter(models.Appointment.doctor_id == user.id)\
            .join(models.Patient)\
            .join(models.Exam)\
            .join(models.DoctorAvailabilitySlot)\
            .all()
    else:
        raise HTTPException(status_code=403, detail="Tipo de usuário inválido")
    
    result = []
    for appointment in appointments:
        slot = appointment.availability_slot
        appointment_detail = schemas.AppointmentWithDetails(
            id=appointment.id,
            patient_name=appointment.patient.full_name,
            doctor_name=appointment.doctor.full_name,
            exam_name=appointment.exam.name,
            date=slot.date,
            start_time=slot.start_time,
            end_time=slot.end_time,
            status=appointment.status,
            notes=appointment.notes,
            created_at=appointment.created_at
        )
        result.append(appointment_detail)
    
    return result

@router.put("/{appointment_id}", response_model=schemas.AppointmentResponse)
def update_appointment(
    appointment_id: int,
    appointment_update: schemas.AppointmentUpdate,
    db: Session = Depends(database.get_db),
    current_user: dict = Depends(get_current_user)
):
    """Atualizar agendamento (paciente pode cancelar, médico pode completar)"""
    
    user = current_user["user"]
    user_type = current_user["user_type"]
    
    # Buscar o agendamento
    appointment = db.query(models.Appointment)\
        .filter(models.Appointment.id == appointment_id).first()
    
    if not appointment:
        raise HTTPException(status_code=404, detail="Agendamento não encontrado")
    
    # Verificar permissões
    if user_type == "patient" and appointment.patient_id != user.id:
        raise HTTPException(status_code=403, detail="Você só pode atualizar seus próprios agendamentos")
    elif user_type == "doctor" and appointment.doctor_id != user.id:
        raise HTTPException(status_code=403, detail="Você só pode atualizar agendamentos dos seus pacientes")
    
    # Atualizar campos permitidos
    if appointment_update.status is not None:
        # Se cancelar, liberar o slot
        if appointment_update.status == "cancelled" and appointment.status != "cancelled":
            slot = db.query(models.DoctorAvailabilitySlot)\
                .filter(models.DoctorAvailabilitySlot.id == appointment.availability_slot_id).first()
            if slot:
                slot.is_available = True
        
        appointment.status = appointment_update.status
    
    if appointment_update.notes is not None:
        appointment.notes = appointment_update.notes
    
    db.commit()
    db.refresh(appointment)
    return appointment

@router.get("/{appointment_id}", response_model=schemas.AppointmentResponse)
def get_appointment(
    appointment_id: int,
    db: Session = Depends(database.get_db),
    current_user: dict = Depends(get_current_user)
):
    """Obter detalhes de um agendamento específico"""
    
    user = current_user["user"]
    user_type = current_user["user_type"]
    
    appointment = db.query(models.Appointment)\
        .filter(models.Appointment.id == appointment_id).first()
    
    if not appointment:
        raise HTTPException(status_code=404, detail="Agendamento não encontrado")
    
    # Verificar permissões
    if user_type == "patient" and appointment.patient_id != user.id:
        raise HTTPException(status_code=403, detail="Você só pode visualizar seus próprios agendamentos")
    elif user_type == "doctor" and appointment.doctor_id != user.id:
        raise HTTPException(status_code=403, detail="Você só pode visualizar agendamentos dos seus pacientes")
    
    return appointment