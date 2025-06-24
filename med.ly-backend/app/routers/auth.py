from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import Union
import bcrypt
from jose import JWTError, jwt
from datetime import datetime

from ..database import get_db
from ..models import Patient, Doctor
from ..schemas import (
    UserLogin, PatientRegister, DoctorRegister, 
    Token, PatientResponse, DoctorResponse
)

router = APIRouter(prefix="/auth")

# Configurações JWT
SECRET_KEY = "your-secret-key-here"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 120

# Usar HTTPBearer em vez de OAuth2PasswordBearer
security = HTTPBearer()

def get_password_hash(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode(), salt)
    return hashed_password.decode()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode(), hashed_password.encode())

def create_access_token(data: dict, expires_delta: Union[timedelta, None] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def authenticate_user(db: Session, email: str, password: str, user_type: str):
    if user_type == "patient":
        user = db.query(Patient).filter(Patient.email == email).first()
    elif user_type == "doctor":
        user = db.query(Doctor).filter(Doctor.email == email).first()
    else:
        return False
    
    if not user:
        return False
    if not verify_password(password, user.password_hash):
        return False
    return user

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    """Retorna o usuário atual baseado no Bearer Token"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # Extrair o token das credenciais
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        user_type: str = payload.get("user_type")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    if user_type == "patient":
        user = db.query(Patient).filter(Patient.email == email).first()
    elif user_type == "doctor":
        user = db.query(Doctor).filter(Doctor.email == email).first()
    else:
        raise credentials_exception
    
    if user is None:
        raise credentials_exception
    
    return {"user": user, "user_type": user_type}

def get_current_patient(current_user: dict = Depends(get_current_user)):
    if current_user["user_type"] != "patient":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acesso negado. Apenas pacientes podem acessar esta rota."
        )
    return current_user["user"]

def get_current_doctor(current_user: dict = Depends(get_current_user)):
    if current_user["user_type"] != "doctor":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acesso negado. Apenas médicos podem acessar esta rota."
        )
    return current_user["user"]

@router.post("/register/patient", response_model=PatientResponse)
def register_patient(patient_data: PatientRegister, db: Session = Depends(get_db)):
    # Verifica se o email já existe
    existing_patient = db.query(Patient).filter(Patient.email == patient_data.email).first()
    existing_doctor = db.query(Doctor).filter(Doctor.email == patient_data.email).first()
    
    if existing_patient or existing_doctor:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email já está em uso"
        )
    
    # Verifica se o CPF já existe
    existing_cpf = db.query(Patient).filter(Patient.cpf == patient_data.cpf).first()
    if existing_cpf:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="CPF já está cadastrado"
        )
    
    hashed_password = get_password_hash(patient_data.password)
    
    db_patient = Patient(
        full_name=patient_data.full_name,
        date_of_birth=patient_data.date_of_birth,
        cpf=patient_data.cpf,
        rg=patient_data.rg,
        sex=patient_data.sex,
        email=patient_data.email,
        phone=patient_data.phone,
        cep=patient_data.cep,
        city=patient_data.city,
        state=patient_data.state,
        emergency_phone=patient_data.emergency_phone,
        emergency_contact_name=patient_data.emergency_contact_name,
        health_insurance_name=patient_data.health_insurance_name,
        health_insurance_number=patient_data.health_insurance_number,
        password_hash=hashed_password,
        current_score=0.0
    )
    
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    
    return db_patient

@router.post("/register/doctor", response_model=DoctorResponse)
def register_doctor(doctor_data: DoctorRegister, db: Session = Depends(get_db)):
    # Verifica se o email já existe
    existing_patient = db.query(Patient).filter(Patient.email == doctor_data.email).first()
    existing_doctor = db.query(Doctor).filter(Doctor.email == doctor_data.email).first()
    
    if existing_patient or existing_doctor:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email já está em uso"
        )
    
    # Verifica se o email já existe
    existing_email = db.query(Doctor).filter(Doctor.email == doctor_data.email).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="email já está em uso"
        )
    
    # Verifica se CRM já existe
    existing_crm = db.query(Doctor).filter(Doctor.crm_number == doctor_data.crm_number).first()
    if existing_crm:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="CRM já está cadastrado"
        )
    
    hashed_password = get_password_hash(doctor_data.password)
    
    db_doctor = Doctor(
        full_name=doctor_data.full_name,
        email=doctor_data.email,
        crm_number=doctor_data.crm_number,
        specialty=doctor_data.specialty,
        state=doctor_data.state,
        password_hash=hashed_password,
        city=doctor_data.city,
        cep=doctor_data.cep,
        number=doctor_data.number,
        complement=doctor_data.complement,
        neighborhood=doctor_data.neighborhood,
        is_currently_active=True,
        current_score=0.0
    )
    
    db.add(db_doctor)
    db.commit()
    db.refresh(db_doctor)
    
    return db_doctor

@router.post("/login", response_model=Token)
def login_for_access_token(user_login: UserLogin, db: Session = Depends(get_db)):
    user = authenticate_user(db, user_login.email, user_login.password, "patient")
    user_type = "patient"
    
    if not user:
        user = authenticate_user(db, user_login.email, user_login.password, "doctor")
        user_type = "doctor"
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "user_type": user_type},
        expires_delta=access_token_expires
    )
    
    user_data = {
        "id": user.id,
        "email": user.email,
    }
    
    if user_type == "doctor":
        user_data.update({
            "full_name": user.full_name,
            "specialty": user.specialty,
            "crm_number": user.crm_number,
            "is_currently_active": user.is_currently_active
        })
    else:
        user_data.update({
            "full_name": user.full_name,
            "cpf": user.cpf
        })
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_type": user_type,
        "user_data": user_data
    }

@router.get("/me")
def get_current_user_info(current_user: dict = Depends(get_current_user)):
    user = current_user["user"]
    user_type = current_user["user_type"]
    
    user_data = {
        "id": user.id,
        "email": user.email,
        "user_type": user_type,
        "current_score": user.current_score
    }
    
    if user_type == "doctor":
        user_data.update({
            "full_name": user.full_name,
            "specialty": user.specialty,
            "crm_number": user.crm_number,
            "state": user.state,
            "city": user.city,
            "cep": user.cep,
            "number": user.number,
            "complement": user.complement,
            "neighborhood": user.neighborhood,
            "is_currently_active": user.is_currently_active
        })
    elif user_type == "patient":
        user_data.update({
            "full_name": user.full_name,
            "date_of_birth": user.date_of_birth,
            "cpf": user.cpf,
            "rg": user.rg,
            "sex": user.sex,
            "phone": user.phone,
            "cep": user.cep,
            "city": user.city,
            "state": user.state,
            "emergency_phone": user.emergency_phone,
            "emergency_contact_name": user.emergency_contact_name,
            "health_insurance_name": user.health_insurance_name,
            "health_insurance_number": user.health_insurance_number
        })
    
    return user_data