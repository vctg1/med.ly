from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas, database
from .auth import get_current_doctor, get_current_user

router = APIRouter(
    prefix="/doctors",
    tags=["doctors"],
    responses={404: {"description": "Not found"}},
)

@router.get("/", response_model=List[schemas.DoctorResponse])
def get_doctors(
    skip: int = 0, 
    limit: int = 100, 
    specialty: str = None,
    state: str = None,
    db: Session = Depends(database.get_db)
):
    """Listar médicos (público) com filtros opcionais"""
    
    query = db.query(models.Doctor).filter(models.Doctor.is_currently_active == True)
    
    if specialty:
        query = query.filter(models.Doctor.specialty.ilike(f"%{specialty}%"))
    
    if state:
        query = query.filter(models.Doctor.state == state)
    
    doctors = query.offset(skip).limit(limit).all()
    return doctors

@router.get("/me", response_model=schemas.DoctorResponse)
def get_my_profile(current_doctor: models.Doctor = Depends(get_current_doctor)):
    """Médico visualiza seu próprio perfil"""
    return current_doctor

@router.put("/me", response_model=schemas.DoctorResponse)
def update_my_profile(
    doctor_update: schemas.DoctorUpdate, 
    db: Session = Depends(database.get_db),
    current_doctor: models.Doctor = Depends(get_current_doctor)
):
    """Médico atualiza seu próprio perfil"""
    
    # Verificar se email não está em uso por outro médico
    if doctor_update.email:
        existing_email = db.query(models.Doctor)\
            .filter(
                models.Doctor.email == doctor_update.email,
                models.Doctor.id != current_doctor.id
            ).first()
        if existing_email:
            raise HTTPException(
                status_code=400, 
                detail="Email já está em uso"
            )
    
    # Verificar se email não está em uso
    if doctor_update.email:
        existing_email = db.query(models.Doctor)\
            .filter(
                models.Doctor.email == doctor_update.email,
                models.Doctor.id != current_doctor.id
            ).first()
        if existing_email:
            raise HTTPException(
                status_code=400, 
                detail="Email já está em uso"
            )
    
    # Atualizar apenas campos fornecidos
    update_data = doctor_update.dict(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(current_doctor, field, value)
    
    db.commit()
    db.refresh(current_doctor)
    return current_doctor

@router.get("/{doctor_id}", response_model=schemas.DoctorResponse)
def get_doctor(doctor_id: int, db: Session = Depends(database.get_db)):
    """Obter dados de um médico específico (público)"""
    
    doctor = db.query(models.Doctor)\
        .filter(
            models.Doctor.id == doctor_id,
            models.Doctor.is_currently_active == True
        ).first()
    
    if not doctor:
        raise HTTPException(status_code=404, detail="Médico não encontrado")
    
    return doctor

@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
def delete_my_account(
    db: Session = Depends(database.get_db),
    current_doctor: models.Doctor = Depends(get_current_doctor)
):
    """Médico deleta sua própria conta (desativa)"""
    
    # Em vez de deletar, desativar o médico
    current_doctor.is_currently_active = False
    db.commit()
    return None