from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from .. import models, schemas, database
from .auth import get_current_doctor

router = APIRouter(
    prefix="/exams",
    tags=["exams"],
    responses={404: {"description": "Not found"}},
)
    
"""Retorna todos os exames existentes no sistema. Parametro q para pesquisar por tipo de exame, nome ou descrição"""
@router.get("/", response_model=List[schemas.ExamResponse])
def get_exams(q: str = None, db: Session = Depends(database.get_db)):
    """Retorna todos os exames existentes no sistema.
    Se o parâmetro `q` for fornecido, filtra os exames por tipo, nome ou descrição.
    Esta rota é pública (não requer autenticação).
    """
    query = db.query(models.Exam)
    if q:
        query = query.filter(
            (models.Exam.exam_type.ilike(f"%{q}%")) |
            (models.Exam.name.ilike(f"%{q}%")) |
            (models.Exam.description.ilike(f"%{q}%"))
        )
    exams = query.all()
    if not exams:
        raise HTTPException(status_code=404, detail="Nenhum exame encontrado")
    return exams

@router.get("/available", response_model=List[schemas.ExamWithAvailability])
def get_exams_with_availability(db: Session = Depends(database.get_db)):
    """
    Retorna todos os exames com informações dos médicos disponíveis e seus horários.
    Esta rota é pública (não requer autenticação).
    """
    exams = db.query(models.Exam).all()
    
    result = []
    for exam in exams:
        # Buscar slots disponíveis para este exame
        available_slots = db.query(models.DoctorAvailabilitySlot)\
            .filter(
                models.DoctorAvailabilitySlot.exam_id == exam.id,
                models.DoctorAvailabilitySlot.is_available == True
            )\
            .join(models.Doctor)\
            .filter(models.Doctor.is_currently_active == True)\
            .all()
        
        # Agrupar slots por médico
        doctors_dict = {}
        for slot in available_slots:
            doctor_id = slot.doctor_id
            if doctor_id not in doctors_dict:
                doctors_dict[doctor_id] = {
                    "doctor_id": slot.doctor.id,
                    "doctor_name": slot.doctor.full_name,
                    "specialty": slot.doctor.specialty,
                    "available_slots": []
                }
            doctors_dict[doctor_id]["available_slots"].append(slot)
        
        exam_data = schemas.ExamWithAvailability(
            id=exam.id,
            name=exam.name,
            exam_type=exam.exam_type,
            duration_minutes=exam.duration_minutes,
            image_url=exam.image_url,
            specialty=exam.specialty,
            description=exam.description,
            doctors_available=list(doctors_dict.values()),
        )
        
        result.append(exam_data)
    
    return result

@router.post("/", response_model=schemas.ExamResponse, status_code=status.HTTP_201_CREATED)
def create_exam(
    exam: schemas.ExamCreate, 
    db: Session = Depends(database.get_db),
    current_doctor: models.Doctor = Depends(get_current_doctor)
):
    """Criar um novo exame (apenas médicos)"""
    
    db_exam = models.Exam(**exam.dict())
    db.add(db_exam)
    db.commit()
    db.refresh(db_exam)
    return db_exam

@router.get("/{exam_id}", response_model=schemas.ExamResponse)
def get_exam(exam_id: int, db: Session = Depends(database.get_db)):
    """Obter detalhes de um exame específico"""
    exam = db.query(models.Exam).filter(models.Exam.id == exam_id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Exame não encontrado")
    return exam