from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import bcrypt

from .. import models, schemas, database

router = APIRouter(
    prefix="/doctors",
    tags=["doctors"],
    responses={404: {"description": "Not found"}},
)

# Função para criar hash de senha
def get_password_hash(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode(), salt)
    return hashed_password.decode()

@router.post("/", response_model=schemas.Doctor, status_code=status.HTTP_201_CREATED)
def create_doctor(doctor: schemas.DoctorCreate, db: Session = Depends(database.get_db)):
    # Verificar se o usuário já existe
    db_doctor = db.query(models.Doctor).filter(models.Doctor.username == doctor.username).first()
    if db_doctor:
        raise HTTPException(status_code=400, detail="Username já está em uso")
    
    # Criar hash da senha
    hashed_password = get_password_hash(doctor.password)
    
    # Criar novo médico
    db_doctor = models.Doctor(
        username=doctor.username,
        name=doctor.name,
        password=hashed_password,
        specialty=doctor.specialty,
        crm=doctor.crm,
        estado=doctor.estado
    )
    
    db.add(db_doctor)
    db.commit()
    db.refresh(db_doctor)
    return db_doctor

@router.get("/", response_model=List[schemas.Doctor])
def read_doctors(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    doctors = db.query(models.Doctor).offset(skip).limit(limit).all()
    return doctors

@router.get("/{doctor_id}", response_model=schemas.Doctor)
def read_doctor(doctor_id: int, db: Session = Depends(database.get_db)):
    doctor = db.query(models.Doctor).filter(models.Doctor.id == doctor_id).first()
    if doctor is None:
        raise HTTPException(status_code=404, detail="Médico não encontrado")
    return doctor

@router.put("/{doctor_id}", response_model=schemas.Doctor)
def update_doctor(doctor_id: int, doctor: schemas.DoctorBase, db: Session = Depends(database.get_db)):
    db_doctor = db.query(models.Doctor).filter(models.Doctor.id == doctor_id).first()
    if db_doctor is None:
        raise HTTPException(status_code=404, detail="Médico não encontrado")
    
    # Atualizar campos do médico
    for key, value in doctor.dict().items():
        setattr(db_doctor, key, value)
    
    db.commit()
    db.refresh(db_doctor)
    return db_doctor

@router.delete("/{doctor_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_doctor(doctor_id: int, db: Session = Depends(database.get_db)):
    db_doctor = db.query(models.Doctor).filter(models.Doctor.id == doctor_id).first()
    if db_doctor is None:
        raise HTTPException(status_code=404, detail="Médico não encontrado")
    
    db.delete(db_doctor)
    db.commit()
    return None