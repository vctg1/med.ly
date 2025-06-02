from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Carrega as variáveis de ambiente do arquivo .env
load_dotenv()

# Obtém a URL de conexão do banco de dados
DATABASE_URL = os.getenv("DATABASE_URL")

# Cria o engine do SQLAlchemy
engine = create_engine(DATABASE_URL)

# Cria uma classe SessionLocal que será usada para criar instâncias de sessão
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Classe base para os modelos
Base = declarative_base()

# Função para obter a sessão do banco de dados
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()