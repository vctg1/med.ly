from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import Union

from ..database import get_db
from ..models import Patient, Doctor
from ..schemas import (
    UserLogin, PatientRegister, DoctorRegister, 
    Token, PatientResponse, DoctorResponse
)
from utils.security import (
    verify_password, get_password_hash, create_access_token, 
    verify_token, ACCESS_TOKEN_EXPIRE_MINUTES
)

router = APIRouter(prefix="/auth")

# OAuth2 scheme para autenticação
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def authenticate_user(db: Session, username: str, password: str, user_type: str):
    """Autentica usuário (paciente ou médico)"""
    if user_type == "patient":
        user = db.query(Patient).filter(Patient.username == username).first()
    elif user_type == "doctor":
        user = db.query(Doctor).filter(Doctor.username == username).first()
    else:
        return False
    
    if not user:
        return False
    if not verify_password(password, user.password_hash.value):
        return False
    return user

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """Retorna o usuário atual baseado no token"""
    token_data = verify_token(token)
    username = token_data["username"]
    user_type = token_data["user_type"]
    
    if user_type == "patient":
        user = db.query(Patient).filter(Patient.username == username).first()
    elif user_type == "doctor":
        user = db.query(Doctor).filter(Doctor.username == username).first()
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Tipo de usuário inválido"
        )
    
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuário não encontrado"
        )
    
    return {"user": user, "user_type": user_type}

@router.post("/register/patient", response_model=PatientResponse)
def register_patient(patient_data: PatientRegister, db: Session = Depends(get_db)):
    """Cadastro de paciente"""
    
    # Verifica se o username já existe
    existing_patient = db.query(Patient).filter(Patient.username == patient_data.username).first()
    existing_doctor = db.query(Doctor).filter(Doctor.username == patient_data.username).first()
    
    if existing_patient or existing_doctor:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username já está em uso"
        )
    
    # Cria hash da senha
    hashed_password = get_password_hash(patient_data.password)
    
    # Cria o paciente
    db_patient = Patient(
        username=patient_data.username,
        password_hash=hashed_password,
        full_name=patient_data.full_name,
        sex=patient_data.sex,
        date_of_birth=patient_data.date_of_birth,
        weight=patient_data.weight,
        height=patient_data.height,
        current_score=0.0
    )
    
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    
    return db_patient

@router.post("/register/doctor", response_model=DoctorResponse)
def register_doctor(doctor_data: DoctorRegister, db: Session = Depends(get_db)):
    """Cadastro de médico"""
    
    # Verifica se o username já existe
    existing_patient = db.query(Patient).filter(Patient.username == doctor_data.username).first()
    existing_doctor = db.query(Doctor).filter(Doctor.username == doctor_data.username).first()
    
    if existing_patient or existing_doctor:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username já está em uso"
        )
    
    # Verifica se CRM já existe
    existing_crm = db.query(Doctor).filter(Doctor.crm_number == doctor_data.crm_number).first()
    if existing_crm:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="CRM já está cadastrado"
        )
    
    # Cria hash da senha
    hashed_password = get_password_hash(doctor_data.password)
    
    # Cria o médico
    db_doctor = Doctor(
        username=doctor_data.username,
        password_hash=hashed_password,
        full_name=doctor_data.full_name,
        specialty=doctor_data.specialty,
        crm_number=doctor_data.crm_number,
        state_active=doctor_data.state_active,
        is_currently_active=True,
        current_score=0.0
    )
    
    db.add(db_doctor)
    db.commit()
    db.refresh(db_doctor)
    
    return db_doctor

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Login de usuário (OAuth2 compatible)"""
    
    # Tenta autenticar como paciente primeiro
    user = authenticate_user(db, form_data.username, form_data.password, "patient")
    user_type = "patient"
    
    # Se não encontrou como paciente, tenta como médico
    if not user:
        user = authenticate_user(db, form_data.username, form_data.password, "doctor")
        user_type = "doctor"
    
    # Se ainda não encontrou, erro de autenticação
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Username ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Cria o token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username, "user_type": user_type},
        expires_delta=access_token_expires
    )
    
    # Dados do usuário para retorno
    user_data = {
        "id": user.id,
        "username": user.username,
        "full_name": user.full_name,
    }
    
    if user_type == "doctor":
        user_data.update({
            "specialty": user.specialty,
            "crm_number": user.crm_number,
            "is_currently_active": user.is_currently_active
        })
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_type": user_type,
        "user_data": user_data
    }

@router.post("/login/custom", response_model=Token)
def login_custom(login_data: UserLogin, db: Session = Depends(get_db)):
    """Login customizado com especificação do tipo de usuário"""
    
    user = authenticate_user(db, login_data.username, login_data.password, login_data.user_type)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Username, senha ou tipo de usuário incorretos",
        )
    
    # Cria o token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username, "user_type": login_data.user_type},
        expires_delta=access_token_expires
    )
    
    # Dados do usuário para retorno
    user_data = {
        "id": user.id,
        "username": user.username,
        "full_name": user.full_name,
    }
    
    if login_data.user_type == "doctor":
        user_data.update({
            "specialty": user.specialty,
            "crm_number": user.crm_number,
            "is_currently_active": user.is_currently_active
        })
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_type": login_data.user_type,
        "user_data": user_data
    }

@router.get("/me")
def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """Retorna informações do usuário atual"""
    user = current_user["user"]
    user_type = current_user["user_type"]
    
    user_data = {
        "id": user.id,
        "username": user.username,
        "full_name": user.full_name,
        "user_type": user_type,
        "current_score": user.current_score
    }
    
    if user_type == "doctor":
        user_data.update({
            "specialty": user.specialty,
            "crm_number": user.crm_number,
            "is_currently_active": user.is_currently_active,
            "state_active": user.state_active
        })
    elif user_type == "patient":
        user_data.update({
            "sex": user.sex,
            "date_of_birth": user.date_of_birth,
            "weight": user.weight,
            "height": user.height
        })
    
    return user_data