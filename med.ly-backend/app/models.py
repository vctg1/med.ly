# models.py
from sqlalchemy import Column, Integer, String, Boolean, Float, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base  # importa o Base da conexão

class Patient(Base):
    __tablename__ = 'patients'
    
    id = Column(Integer, primary_key=True)
    username = Column(String, nullable=False)
    password_hash = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    sex = Column(String)
    date_of_birth = Column(Date)
    weight = Column(Float)
    height = Column(Float)
    current_score = Column(Float)

    appointments = relationship("Appointment", back_populates="patient")
    exams = relationship("Exam", back_populates="patient")
    reviews = relationship("PatientReview", back_populates="patient")

class Doctor(Base):
    __tablename__ = 'doctors'
    
    id = Column(Integer, primary_key=True)
    username = Column(String, nullable=False)
    password_hash = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    specialty = Column(String)
    crm_number = Column(String, unique=True)
    state_active = Column(String)
    is_currently_active = Column(Boolean, default=True)
    current_score = Column(Float)

    appointments = relationship("Appointment", back_populates="doctor")
    exams = relationship("Exam", back_populates="doctor")
    reviews = relationship("PatientReview", back_populates="doctor")

class Clinic(Base):
    __tablename__ = 'clinics'

    id = Column(Integer, primary_key=True)
    full_legal_name = Column(String, nullable=False)
    adress = Column(String)
    details = Column(String)

    exams = relationship("Exam", back_populates="clinic")
    reviews = relationship("PatientReview", back_populates="clinic")

class Appointment(Base):
    __tablename__ = 'appointments'
    
    id = Column(Integer, primary_key=True)
    patient_id = Column(Integer, ForeignKey('patients.id'))
    doctor_id = Column(Integer, ForeignKey('doctors.id'))
    date_time = Column(DateTime)
    status = Column(String, default="scheduled")

    patient = relationship("Patient", back_populates="appointments")
    doctor = relationship("Doctor", back_populates="appointments")

class Exam(Base):
    __tablename__ = 'exams'

    id = Column(Integer, primary_key=True)
    patient_id = Column(Integer, ForeignKey('patients.id'))
    doctor_id = Column(Integer, ForeignKey('doctors.id'))
    clinic_id = Column(Integer, ForeignKey('clinics.id'))
    exam_type = Column(String, nullable=False)
    scheduled_by_patient = Column(Boolean, default=False)

    patient = relationship("Patient", back_populates="exams")
    doctor = relationship("Doctor", back_populates="exams")
    clinic = relationship("Clinic", back_populates="exams")

class PatientReview(Base):
    __tablename__ = 'patient_reviews'

    id = Column(Integer, primary_key=True)
    general_score = Column(Float)
    appointment_score = Column(Float)
    doctor_score = Column(Float)
    clinic_score = Column(Float)
    feedback = Column(String(500))

    id_patient = Column(Integer, ForeignKey('patients.id'))
    id_doctor = Column(Integer, ForeignKey('doctors.id'))
    id_clinic = Column(Integer, ForeignKey('clinics.id'))

    patient = relationship("Patient", back_populates="reviews")
    doctor = relationship("Doctor", back_populates="reviews")
    clinic = relationship("Clinic", back_populates="reviews")
