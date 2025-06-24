from pydantic import BaseModel, EmailStr, validator
from typing import Optional, List
from datetime import date, datetime, time

# ============= AUTH SCHEMAS =============
class UserLogin(BaseModel):
    email: str
    password: str

class PatientRegister(BaseModel):
    full_name: str
    date_of_birth: date
    cpf: str
    rg: str
    sex: Optional[str] = None
    email: str
    phone: str
    cep: str
    city: str
    state: str
    emergency_phone: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    health_insurance_name: Optional[str] = None
    health_insurance_number: Optional[str] = None
    password: str
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 6:
            raise ValueError('Senha deve ter no mínimo 6 caracteres')
        return v
    
    @validator('cpf')
    def validate_cpf(cls, v):
        # Remove caracteres não numéricos
        cpf = ''.join(filter(str.isdigit, v))
        if len(cpf) != 11:
            raise ValueError('CPF deve ter 11 dígitos')
        return cpf

class DoctorRegister(BaseModel):
    full_name: str
    email: str
    crm_number: str
    specialty: str
    state: str
    password: str
    city: str
    cep: str
    number: str
    complement: Optional[str] = None
    neighborhood: str
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 6:
            raise ValueError('Senha deve ter no mínimo 6 caracteres')
        return v

class Token(BaseModel):
    access_token: str
    token_type: str
    user_type: str
    user_data: dict

class TokenData(BaseModel):
    email: Optional[str] = None
    user_type: Optional[str] = None

# ============= PATIENT SCHEMAS =============
class PatientBase(BaseModel):
    full_name: str
    date_of_birth: date
    cpf: str
    rg: str
    sex: Optional[str] = None
    email: str
    phone: str
    cep: str
    city: str
    state: str
    emergency_phone: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    health_insurance_name: Optional[str] = None
    health_insurance_number: Optional[str] = None

class PatientCreate(PatientBase):
    password: str
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 6:
            raise ValueError('Senha deve ter no mínimo 6 caracteres')
        return v

class PatientUpdate(BaseModel):
    full_name: Optional[str] = None
    date_of_birth: Optional[date] = None
    rg: Optional[str] = None
    sex: Optional[str] = None
    phone: Optional[str] = None
    cep: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    emergency_phone: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    health_insurance_name: Optional[str] = None
    health_insurance_number: Optional[str] = None

class PatientResponse(PatientBase):
    id: int
    current_score: Optional[float] = None
    
    class Config:
        from_attributes = True

# ============= DOCTOR SCHEMAS =============
class DoctorBase(BaseModel):
    full_name: str
    email: str
    crm_number: str
    specialty: str
    state: str
    city: str
    cep: str
    number: str
    complement: Optional[str] = None
    neighborhood: str

class DoctorCreate(DoctorBase):
    password: str
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 6:
            raise ValueError('Senha deve ter no mínimo 6 caracteres')
        return v

class DoctorUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    specialty: Optional[str] = None
    state: Optional[str] = None
    city: Optional[str] = None
    cep: Optional[str] = None
    number: Optional[str] = None
    complement: Optional[str] = None
    neighborhood: Optional[str] = None
    is_currently_active: Optional[bool] = None

class DoctorResponse(DoctorBase):
    id: int
    is_currently_active: bool
    current_score: Optional[float] = None
    
    class Config:
        from_attributes = True

# ============= EXAM SCHEMAS =============
class ExamBase(BaseModel):
    name: str
    exam_type: str
    duration_minutes: int = 30
    description: Optional[str] = None
    image_url: Optional[str] = None
    specialty: str

class ExamCreate(ExamBase):
    pass

class ExamUpdate(BaseModel):
    name: Optional[str] = None
    exam_type: Optional[str] = None
    duration_minutes: Optional[int] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    specialty: Optional[str] = None

class ExamResponse(ExamBase):
    id: int
    
    class Config:
        from_attributes = True

# ============= DOCTOR AVAILABILITY SCHEMAS =============
class DoctorAvailabilitySlotBase(BaseModel):
    exam_id: int
    date: date
    start_time: time
    end_time: time

class DoctorAvailabilitySlotCreate(DoctorAvailabilitySlotBase):
    pass

class DoctorAvailabilitySlotUpdate(BaseModel):
    date: Optional["date"] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    is_available: Optional[bool] = None

class DoctorAvailabilitySlotResponse(BaseModel):
    id: int
    doctor_id: int
    exam_id: int
    date: date
    start_time: time
    end_time: time
    is_available: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# ============= APPOINTMENT SCHEMAS =============
class AppointmentCreate(BaseModel):
    availability_slot_id: int
    notes: Optional[str] = None

class AppointmentUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None

class AppointmentResponse(BaseModel):
    id: int
    patient_id: int
    doctor_id: int
    exam_id: int
    availability_slot_id: int
    date_time: datetime
    status: str
    notes: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

# ============= COMBINED SCHEMAS FOR FRONTEND =============
class DoctorAvailabilityForExam(BaseModel):
    doctor_id: int
    doctor_name: str
    specialty: str
    available_slots: List[DoctorAvailabilitySlotResponse]

class ExamWithAvailability(BaseModel):
    id: int
    name: str
    exam_type: str
    duration_minutes: int
    description: Optional[str] = None
    specialty: str
    image_url: Optional[str] = None
    doctors_available: List[DoctorAvailabilityForExam]


class AppointmentWithDetails(BaseModel):
    id: int
    patient_name: str
    doctor_name: str
    exam_name: str
    date: date
    start_time: time
    end_time: time
    status: str
    notes: Optional[str] = None
    created_at: datetime