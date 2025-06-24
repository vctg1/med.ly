# from fastapi import APIRouter, Depends, HTTPException, status
# from sqlalchemy.orm import Session
# from typing import List

# from .. import models, schemas, database

# router = APIRouter(
#     prefix="/ratings",
#     tags=["ratings"],
#     responses={404: {"description": "Not found"}},
# )

# @router.post("/", response_model=schemas.Rating, status_code=status.HTTP_201_CREATED)
# def create_rating(rating: schemas.RatingCreate, db: Session = Depends(database.get_db)):
#     # Verificar se o médico existe
#     doctor = db.query(models.Doctor).filter(models.Doctor.id == rating.doctor_id).first()
#     if not doctor:
#         raise HTTPException(status_code=404, detail="Médico não encontrado")
    
#     # Verificar se o paciente existe
#     patient = db.query(models.Patient).filter(models.Patient.id == rating.patient_id).first()
#     if not patient:
#         raise HTTPException(status_code=404, detail="Paciente não encontrado")
    
#     # Criar nova avaliação
#     db_rating = models.Rating(
#         doctor_id=rating.doctor_id,
#         patient_id=rating.patient_id,
#         rating=rating.rating,
#         review=rating.review
#     )
    
#     db.add(db_rating)
#     db.commit()
#     db.refresh(db_rating)
#     return db_rating

# @router.get("/", response_model=List[schemas.Rating])
# def read_ratings(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
#     ratings = db.query(models.Rating).offset(skip).limit(limit).all()
#     return ratings

# @router.get("/{rating_id}", response_model=schemas.Rating)
# def read_rating(rating_id: int, db: Session = Depends(database.get_db)):
#     rating = db.query(models.Rating).filter(models.Rating.id == rating_id).first()
#     if rating is None:
#         raise HTTPException(status_code=404, detail="Avaliação não encontrada")
#     return rating

# @router.put("/{rating_id}", response_model=schemas.Rating)
# def update_rating(rating_id: int, rating: schemas.RatingCreate, db: Session = Depends(database.get_db)):
#     db_rating = db.query(models.Rating).filter(models.Rating.id == rating_id).first()
#     if db_rating is None:
#         raise HTTPException(status_code=404, detail="Avaliação não encontrada")
    
#     # Atualizar campos da avaliação
#     for key, value in rating.dict().items():
#         setattr(db_rating, key, value)
    
#     db.commit()
#     db.refresh(db_rating)
#     return db_rating

# @router.delete("/{rating_id}", status_code=status.HTTP_204_NO_CONTENT)
# def delete_rating(rating_id: int, db: Session = Depends(database.get_db)):
#     db_rating = db.query(models.Rating).filter(models.Rating.id == rating_id).first()
#     if db_rating is None:
#         raise HTTPException(status_code=404, detail="Avaliação não encontrada")
    
#     db.delete(db_rating)
#     db.commit()
#     return None