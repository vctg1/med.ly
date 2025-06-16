from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from .database import engine, Base
from .routers import patients, doctors, appointments, auth, reviews

# Cria as tabelas no banco de dados
Base.metadata.create_all(bind=engine)

# Cria a aplicação FastAPI
app = FastAPI(
    title="Healthcare API",
    description="API para gerenciamento de consultas médicas",
    version="0.1.0"
)

# Configuração do CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especifique as origens permitidas
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclusão dos routers
app.include_router(patients.router, tags=["patients"])
app.include_router(doctors.router, tags=["doctors"])
app.include_router(appointments.router, tags=["appointments"])
app.include_router(reviews.router, tags=["ratings"])
app.include_router(auth.router, tags=["auth"])

# Rota raiz
@app.get("/")
def read_root():
    return {"message": "Bem-vindo à API de Saúde"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)