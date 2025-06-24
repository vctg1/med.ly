# # models.py
# from sqlalchemy import Column, Integer, String, Boolean, Float, Date, DateTime, ForeignKey
# from sqlalchemy.orm import relationship
# from .database import Base  # importa o Base da conexão

# class Patient(Base):
#     __tablename__ = 'patients'
    
#     id = Column(Integer, primary_key=True)
#     email = Column(String, nullable=False)
#     password_hash = Column(String, nullable=False)
#     full_name = Column(String, nullable=False)
#     sex = Column(String)
#     date_of_birth = Column(Date)
#     weight = Column(Float)
#     height = Column(Float)
#     current_score = Column(Float)

#     appointments = relationship("Appointment", back_populates="patient")
#     # exams = relationship("Exam", back_populates="patient")
#     # reviews = relationship("PatientReview", back_populates="patient")

# class Doctor(Base):
#     __tablename__ = 'doctors'
    
#     id = Column(Integer, primary_key=True)
#     email = Column(String, nullable=False)
#     password_hash = Column(String, nullable=False)
#     full_name = Column(String, nullable=False)
#     specialty = Column(String)
#     crm_number = Column(String, unique=True)
#     state_active = Column(String)
#     is_currently_active = Column(Boolean, default=True)
#     current_score = Column(Float)

#     appointments = relationship("Appointment", back_populates="doctor")
#     # exams = relationship("Exam", back_populates="doctor")
#     # reviews = relationship("PatientReview", back_populates="doctor")

# # class Clinic(Base):
# #     __tablename__ = 'clinics'

# #     id = Column(Integer, primary_key=True)
# #     full_legal_name = Column(String, nullable=False)
# #     adress = Column(String)
# #     details = Column(String)

# #     exams = relationship("Exam", back_populates="clinic")
# #     reviews = relationship("PatientReview", back_populates="clinic")

# class Appointment(Base):
#     __tablename__ = 'appointments'
    
#     id = Column(Integer, primary_key=True)
#     name = Column(String, nullable=False)
#     patient_id = Column(Integer, ForeignKey('patients.id'))
#     doctor_id = Column(Integer, ForeignKey('doctors.id'))
#     exam_id = Column(Integer, ForeignKey('exams.id'), nullable=True)
#     date_time = Column(DateTime)
#     status = Column(String, default="scheduled")
#     type = Column(String, nullable=False)
    
#     exam = relationship("Exam", back_populates="appointments", uselist=False)
#     patient = relationship("Patient", back_populates="appointments")
#     doctor = relationship("Doctor", back_populates="appointments")

# class DoctorsSchedule(Base):
#     __tablename__ = 'appointment_schedules'
    
#     id = Column(Integer, primary_key=True)
#     appointment_id = Column(Integer, ForeignKey('appointments.id'))
#     doctor_id = Column(Integer, ForeignKey('doctors.id'))
#     day_of_week = Column(String, nullable=False)
#     start_time = Column(String, nullable=False)
#     end_time = Column(String, nullable=False)

#     appointment = relationship("Appointment", back_populates="appointment_schedules")
#     doctor = relationship("Doctor", back_populates="appointment_schedules")


# class Exam(Base):
#     __tablename__ = 'exams'

#     id = Column(Integer, primary_key=True)
#     name = Column(String, nullable=False)
#     patient_id = Column(Integer, ForeignKey('patients.id'))
#     doctor_id = Column(Integer, ForeignKey('doctors.id'))
#     exam_type = Column(String, nullable=False)
#     #clinic_id = Column(Integer, ForeignKey('clinics.id'))

#     patient = relationship("Patient", back_populates="exams")
#     doctor = relationship("Doctor", back_populates="exams")
#     #clinic = relationship("Clinic", back_populates="exams")

# # class PatientReview(Base):
# #     __tablename__ = 'patient_reviews'

# #     id = Column(Integer, primary_key=True)
# #     general_score = Column(Float)
# #     appointment_score = Column(Float)
# #     doctor_score = Column(Float)
# #     clinic_score = Column(Float)
# #     feedback = Column(String(500))

# #     id_patient = Column(Integer, ForeignKey('patients.id'))
# #     id_doctor = Column(Integer, ForeignKey('doctors.id'))
# #     id_clinic = Column(Integer, ForeignKey('clinics.id'))

# #     patient = relationship("Patient", back_populates="reviews")
# #     doctor = relationship("Doctor", back_populates="reviews")
# #     clinic = relationship("Clinic", back_populates="reviews")
