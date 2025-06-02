from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import date, datetime

# Schemas para Patient
class PatientBase(BaseModel):
    username: str
    name: str
    date_of_birth: Optional[date] = None
    gender: Optional[str] = None
    weight: Optional[float] = None
    height: Optional[float] = None

class PatientCreate(PatientBase):
    password: str

class Patient(PatientBase):
    id: int
    # Não incluímos o campo profile_picture aqui porque não é serializado facilmente

    class Config:
        orm_mode = True

# Schemas para Doctor
class DoctorBase(BaseModel):
    username: str
    name: str
    specialty: str
    crm: str
    estado: str = ""

class DoctorCreate(DoctorBase):
    password: str

class Doctor(DoctorBase):
    id: int
    # Não incluímos o campo profile_picture aqui porque não é serializado facilmente

    class Config:
        orm_mode = True

# Schemas para Appointment
class AppointmentBase(BaseModel):
    patient_id: int
    doctor_id: int
    appointment_datetime: datetime

class AppointmentCreate(AppointmentBase):
    pass

class Appointment(AppointmentBase):
    id: int
    
    class Config:
        orm_mode = True

# Schemas para Rating
class RatingBase(BaseModel):
    doctor_id: int
    patient_id: int
    rating: int = Field(..., ge=1, le=5)
    review: Optional[str] = ""

class RatingCreate(RatingBase):
    pass

class Rating(RatingBase):
    id: int
    
    class Config:
        orm_mode = True