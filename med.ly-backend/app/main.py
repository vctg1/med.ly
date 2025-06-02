from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import engine
from . import models
from .routers import patients, doctors, appointments, ratings

# Cria as tabelas no banco de dados
models.Base.metadata.create_all(bind=engine)

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
app.include_router(doctors.router)
app.include_router(appointments.router)
app.include_router(ratings.router)

# Rota raiz
@app.get("/")
def read_root():
    return {"message": "Bem-vindo à API de Saúde"}

# Para iniciar o servidor (adicione isto ao final do arquivo ou execute via terminal):
# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)