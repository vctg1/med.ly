from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
import uvicorn
from .database import engine, Base
from .routers import patients, doctors, appointments, availability, auth, exams

# Cria as tabelas no banco de dados
Base.metadata.create_all(bind=engine)

# Cria a aplicação FastAPI
app = FastAPI(
    title="Healthcare API",
    description="API para gerenciamento de consultas médicas",
    version="0.1.0",
    swagger_ui_parameters={
        "defaultModelsExpandDepth": -1,
        "docExpansion": "none",
        "persistAuthorization": True,  # Mantém o token após refresh
    }
)

# Configuração do CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especifique as origens permitidas
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Token
security_scheme = HTTPBearer()

# Inclusão dos routers
app.include_router(patients.router, tags=["patients"])
app.include_router(doctors.router, tags=["doctors"])
app.include_router(appointments.router, tags=["appointments"])
app.include_router(availability.router, tags=["availability"])
# app.include_router(reviews.router, tags=["ratings"])
app.include_router(auth.router, tags=["auth"])
app.include_router(exams.router, tags=["exams"])

# Rota raiz
@app.get("/")
def read_root():
    return {"message": "Bem-vindo à API de Saúde"}