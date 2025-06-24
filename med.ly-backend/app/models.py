from sqlalchemy import Column, Integer, String, Boolean, Float, Date, DateTime, ForeignKey, Time
from sqlalchemy.orm import relationship
from .database import Base

class Patient(Base):
    __tablename__ = 'patients'
    
    id = Column(Integer, primary_key=True)
    full_name = Column(String, nullable=False)
    date_of_birth = Column(Date, nullable=False)
    cpf = Column(String, nullable=False, unique=True)
    rg = Column(String, nullable=False)
    sex = Column(String)
    email = Column(String, nullable=False, unique=True)
    phone = Column(String, nullable=False)
    cep = Column(String, nullable=False)
    city = Column(String, nullable=False)
    state = Column(String, nullable=False)
    emergency_phone = Column(String)
    emergency_contact_name = Column(String)
    health_insurance_name = Column(String)
    health_insurance_number = Column(String)
    password_hash = Column(String, nullable=False)
    current_score = Column(Float, default=0.0)

    appointments = relationship("Appointment", back_populates="patient", cascade="all, delete-orphan")

class Doctor(Base):
    __tablename__ = 'doctors'
    
    id = Column(Integer, primary_key=True)
    full_name = Column(String, nullable=False, unique=True)
    email = Column(String, nullable=False, unique=True)
    crm_number = Column(String, nullable=False, unique=True)
    specialty = Column(String, nullable=False)
    state = Column(String, nullable=False)
    password_hash = Column(String, nullable=False)
    city = Column(String, nullable=False)
    cep = Column(String, nullable=False)
    number = Column(String, nullable=False)
    complement = Column(String)
    neighborhood = Column(String, nullable=False)
    is_currently_active = Column(Boolean, default=True)
    current_score = Column(Float, default=0.0)

    appointments = relationship("Appointment", back_populates="doctor", cascade="all, delete-orphan")
    availability_slots = relationship("DoctorAvailabilitySlot", back_populates="doctor", cascade="all, delete-orphan")

class Exam(Base):
    __tablename__ = 'exams'

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    exam_type = Column(String, nullable=False)
    duration_minutes = Column(Integer, nullable=False, default=30)
    description = Column(String)
    specialty = Column(String, nullable=False)
    image_url = Column(String)

    doctor_availability_slots = relationship("DoctorAvailabilitySlot", back_populates="exam", cascade="all, delete-orphan")
    appointments = relationship("Appointment", back_populates="exam", cascade="all, delete-orphan")

class DoctorAvailabilitySlot(Base):
    __tablename__ = 'doctor_availability_slots'
    
    id = Column(Integer, primary_key=True)
    doctor_id = Column(Integer, ForeignKey('doctors.id', ondelete='CASCADE'), nullable=False)
    exam_id = Column(Integer, ForeignKey('exams.id', ondelete='CASCADE'), nullable=False)
    date = Column(Date, nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    is_available = Column(Boolean, default=True)
    created_at = Column(DateTime, nullable=False)

    doctor = relationship("Doctor", back_populates="availability_slots")
    exam = relationship("Exam", back_populates="doctor_availability_slots")
    appointment = relationship("Appointment", back_populates="availability_slot", uselist=False, cascade="all, delete-orphan")

class Appointment(Base):
    __tablename__ = 'appointments'
    
    id = Column(Integer, primary_key=True)
    patient_id = Column(Integer, ForeignKey('patients.id', ondelete='CASCADE'), nullable=False)
    doctor_id = Column(Integer, ForeignKey('doctors.id', ondelete='CASCADE'), nullable=False)
    exam_id = Column(Integer, ForeignKey('exams.id', ondelete='CASCADE'), nullable=False)
    availability_slot_id = Column(Integer, ForeignKey('doctor_availability_slots.id', ondelete='CASCADE'), nullable=False)
    date_time = Column(DateTime, nullable=False)
    status = Column(String, default="scheduled")
    notes = Column(String)
    created_at = Column(DateTime, nullable=False)
    
    patient = relationship("Patient", back_populates="appointments")
    doctor = relationship("Doctor", back_populates="appointments")
    exam = relationship("Exam", back_populates="appointments")
    availability_slot = relationship("DoctorAvailabilitySlot", back_populates="appointment")