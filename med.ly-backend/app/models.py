from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Date, LargeBinary
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from .database import Base

class Patient(Base):
    __tablename__ = "patients"
    
    id = Column(Integer, primary_key=True)
    username = Column(String(20), nullable=False, unique=True)
    name = Column(String(50), nullable=False)
    password = Column(String(255), nullable=False)  # Aumentei o tamanho para armazenar hash
    date_of_birth = Column(Date)
    gender = Column(String(10))
    weight = Column(Float)
    height = Column(Float)
    profile_picture = Column(LargeBinary)
    
    # Relacionamento com appointments
    appointments = relationship("Appointment", back_populates="patient")
    
    # Relacionamento com ratings
    ratings = relationship("Rating", back_populates="patient")
    
    def is_authenticated(self):
        return True
        
    def is_active(self):
        return True
        
    def is_anonymous(self):
        return False
        
    def get_id(self):
        return str(self.id)


class Doctor(Base):
    __tablename__ = "doctors"
    
    id = Column(Integer, primary_key=True)
    password = Column(String(255), nullable=False)  # Aumentei o tamanho para armazenar hash
    username = Column(String(20), nullable=False, unique=True)
    name = Column(String(50), nullable=False)
    specialty = Column(String(30), nullable=False)
    crm = Column(String(6), nullable=False)
    estado = Column(String(30), nullable=False, default="")
    profile_picture = Column(LargeBinary)
    
    # Relacionamento com appointments
    appointments = relationship("Appointment", back_populates="doctor")
    
    # Relacionamento com ratings
    ratings = relationship("Rating", back_populates="doctor")
    
    def is_authenticated(self):
        return True
        
    def is_active(self):
        return True
        
    def is_anonymous(self):
        return False
        
    def get_id(self):
        return str(self.id)


class Appointment(Base):
    __tablename__ = "appointments"
    
    id = Column(Integer, primary_key=True)
    patient_id = Column(Integer, ForeignKey('patients.id'), nullable=False)
    doctor_id = Column(Integer, ForeignKey('doctors.id'), nullable=False)
    appointment_datetime = Column(DateTime, nullable=False)
    
    # Relacionamentos
    patient = relationship("Patient", back_populates="appointments")
    doctor = relationship("Doctor", back_populates="appointments")


class Rating(Base):
    __tablename__ = "ratings"
    
    id = Column(Integer, primary_key=True)
    doctor_id = Column(Integer, ForeignKey('doctors.id'), nullable=False)
    patient_id = Column(Integer, ForeignKey('patients.id'), nullable=False)
    rating = Column(Integer, nullable=False)
    review = Column(String(500), nullable=True, default="")
    
    # Relacionamentos
    patient = relationship("Patient", back_populates="ratings")
    doctor = relationship("Doctor", back_populates="ratings")