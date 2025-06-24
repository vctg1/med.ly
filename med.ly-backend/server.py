import uvicorn
from app.database import engine
from app.models import Base

def create_tables():
    """Cria todas as tabelas no banco de dados"""
    Base.metadata.create_all(bind=engine)
    print("Tabelas criadas com sucesso!")

if __name__ == "__main__":
    create_tables()
    uvicorn.run("app.main:app", host="localhost", port=8000, reload=True)