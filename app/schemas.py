from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date, datetime

# ============= AUTH SCHEMAS =============
class UserLogin(BaseModel):
    username: str
    password: str
    user_type: str  # "patient" ou "doctor"

class PatientRegister(BaseModel):
    username: str
    password: str
    full_name: str
    sex: Optional[str] = None
    date_of_birth: Optional[date] = None
    weight: Optional[float] = None
    height: Optional[float] = None

class DoctorRegister(BaseModel):
    username: str
    password: str
    full_name: str
    specialty: Optional[str] = None
    crm_number: str
    state_active: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str
    user_type: str
    user_data: dict

class TokenData(BaseModel):
    username: Optional[str] = None
    user_type: Optional[str] = None

# ============= PATIENT SCHEMAS =============
class PatientBase(BaseModel):
    username: str
    full_name: str
    sex: Optional[str] = None
    date_of_birth: Optional[date] = None
    weight: Optional[float] = None
    height: Optional[float] = None

class PatientCreate(PatientBase):
    password: str

class PatientUpdate(BaseModel):
    full_name: Optional[str] = None
    sex: Optional[str] = None
    date_of_birth: Optional[date] = None
    weight: Optional[float] = None
    height: Optional[float] = None

class PatientResponse(PatientBase):
    id: int
    current_score: Optional[float] = None
    
    class Config:
        from_attributes = True

# ============= DOCTOR SCHEMAS =============
class DoctorBase(BaseModel):
    username: str
    full_name: str
    specialty: Optional[str] = None
    crm_number: str
    state_active: Optional[str] = None

class DoctorCreate(DoctorBase):
    password: str

class DoctorUpdate(BaseModel):
    full_name: Optional[str] = None
    specialty: Optional[str] = None
    state_active: Optional[str] = None
    is_currently_active: Optional[bool] = None

class DoctorResponse(DoctorBase):
    id: int
    is_currently_active: bool
    current_score: Optional[float] = None
    
    class Config:
        from_attributes = True

# ============= APPOINTMENT SCHEMAS =============
class AppointmentBase(BaseModel):
    patient_id: int
    doctor_id: int
    date_time: datetime
    status: Optional[str] = "scheduled"

class AppointmentCreate(AppointmentBase):
    pass

class AppointmentUpdate(BaseModel):
    date_time: Optional[datetime] = None
    status: Optional[str] = None

class AppointmentResponse(AppointmentBase):
    id: int
    
    class Config:
        from_attributes = True

# ============= CLINIC SCHEMAS =============
class ClinicBase(BaseModel):
    full_legal_name: str
    adress: Optional[str] = None
    details: Optional[str] = None

class ClinicCreate(ClinicBase):
    pass

class ClinicResponse(ClinicBase):
    id: int
    
    class Config:
        from_attributes = True

# ============= EXAM SCHEMAS =============
class ExamBase(BaseModel):
    patient_id: int
    doctor_id: int
    clinic_id: int
    exam_type: str
    scheduled_by_patient: Optional[bool] = False

class ExamCreate(ExamBase):
    pass

class ExamResponse(ExamBase):
    id: int
    
    class Config:
        from_attributes = True

# ============= REVIEW SCHEMAS =============
class PatientReviewBase(BaseModel):
    general_score: Optional[float] = None
    appointment_score: Optional[float] = None
    doctor_score: Optional[float] = None
    clinic_score: Optional[float] = None
    feedback: Optional[str] = None
    id_patient: int
    id_doctor: int
    id_clinic: int

class PatientReviewCreate(PatientReviewBase):
    pass

class PatientReviewResponse(PatientReviewBase):
    id: int
    
    class Config:
        from_attributes = True