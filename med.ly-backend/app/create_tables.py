from database import engine
from models import Base

# ✅ Cria todas as tabelas definidas nos modelos
def create_all_tables():
    Base.metadata.create_all(bind=engine)
    print("✅ Tabelas criadas com sucesso!")

# ❌ Função para apagar todas as tabelas (DROPAR o schema inteiro)
# ⚠️ Use com cuidado! Rode manualmente quando necessário.
# def drop_all_tables():
#     Base.metadata.drop_all(bind=engine)
#     print("⚠️ Todas as tabelas foram removidas do banco de dados!")

if __name__ == "__main__":
    create_all_tables()
    
    # Para apagar todas as tabelas, descomente a linha abaixo e rode este arquivo
    # drop_all_tables()
