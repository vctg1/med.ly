from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import bcrypt

from .. import models, schemas, database

router = APIRouter(
    prefix="/patients",
    tags=["patients"],
    responses={404: {"description": "Not found"}},
)

# Função para criar hash de senha
def get_password_hash(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode(), salt)
    return hashed_password.decode()

# Função para verificar senha
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode(), hashed_password.encode())

@router.post("/", response_model=schemas.Patient, status_code=status.HTTP_201_CREATED)
def create_patient(patient: schemas.PatientCreate, db: Session = Depends(database.get_db)):
    # Verificar se o usuário já existe
    db_patient = db.query(models.Patient).filter(models.Patient.username == patient.username).first()
    if db_patient:
        raise HTTPException(status_code=400, detail="Username já está em uso")
    
    # Criar hash da senha
    hashed_password = get_password_hash(patient.password)
    
    # Criar novo paciente
    db_patient = models.Patient(
        username=patient.username,
        name=patient.name,
        password=hashed_password,
        date_of_birth=patient.date_of_birth,
        gender=patient.gender,
        weight=patient.weight,
        height=patient.height
    )
    
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient

@router.get("/", response_model=List[schemas.Patient])
def read_patients(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    patients = db.query(models.Patient).offset(skip).limit(limit).all()
    return patients

@router.get("/{patient_id}", response_model=schemas.Patient)
def read_patient(patient_id: int, db: Session = Depends(database.get_db)):
    patient = db.query(models.Patient).filter(models.Patient.id == patient_id).first()
    if patient is None:
        raise HTTPException(status_code=404, detail="Paciente não encontrado")
    return patient

@router.put("/{patient_id}", response_model=schemas.Patient)
def update_patient(patient_id: int, patient: schemas.PatientBase, db: Session = Depends(database.get_db)):
    db_patient = db.query(models.Patient).filter(models.Patient.id == patient_id).first()
    if db_patient is None:
        raise HTTPException(status_code=404, detail="Paciente não encontrado")
    
    # Atualizar campos do paciente
    for key, value in patient.dict().items():
        setattr(db_patient, key, value)
    
    db.commit()
    db.refresh(db_patient)
    return db_patient

@router.delete("/{patient_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_patient(patient_id: int, db: Session = Depends(database.get_db)):
    db_patient = db.query(models.Patient).filter(models.Patient.id == patient_id).first()
    if db_patient is None:
        raise HTTPException(status_code=404, detail="Paciente não encontrado")
    
    db.delete(db_patient)
    db.commit()
    return None