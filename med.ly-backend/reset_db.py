from app.database import engine
from app.models import Base

def recreate_tables():
    """Dropa todas as tabelas e cria novamente"""
    print("Dropando todas as tabelas...")
    Base.metadata.drop_all(bind=engine)
    print("Tabelas dropadas com sucesso!")
    
    print("Criando tabelas novamente...")
    Base.metadata.create_all(bind=engine)
    print("Tabelas criadas com sucesso!")

if __name__ == "__main__":
    recreate_tables()