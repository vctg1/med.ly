from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas, database
from .auth import get_current_patient, get_current_user

router = APIRouter(
    prefix="/patients",
    tags=["patients"],
    responses={404: {"description": "Not found"}},
)

@router.get("/me", response_model=schemas.PatientResponse)
def get_my_profile(current_patient: models.Patient = Depends(get_current_patient)):
    """Paciente visualiza seu próprio perfil"""
    return current_patient

@router.put("/me", response_model=schemas.PatientResponse)
def update_my_profile(
    patient_update: schemas.PatientUpdate, 
    db: Session = Depends(database.get_db),
    current_patient: models.Patient = Depends(get_current_patient)
):
    """Paciente atualiza seu próprio perfil"""
    
    # Atualizar apenas campos fornecidos
    update_data = patient_update.dict(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(current_patient, field, value)
    
    db.commit()
    db.refresh(current_patient)
    return current_patient

@router.get("/{patient_id}", response_model=schemas.PatientResponse)
def get_patient(
    patient_id: int, 
    db: Session = Depends(database.get_db),
    current_user: dict = Depends(get_current_user)
):
    """Obter dados de um paciente específico (requer autenticação)"""
    
    patient = db.query(models.Patient).filter(models.Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Paciente não encontrado")
    
    # Paciente só pode ver seus próprios dados, médicos podem ver qualquer paciente
    user_type = current_user["user_type"]
    if user_type == "patient" and current_user["user"].id != patient_id:
        raise HTTPException(
            status_code=403, 
            detail="Você só pode visualizar seu próprio perfil"
        )
    
    return patient

@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
def delete_my_account(
    db: Session = Depends(database.get_db),
    current_patient: models.Patient = Depends(get_current_patient)
):
    """Paciente deleta sua própria conta"""
    
    db.delete(current_patient)
    db.commit()
    return None