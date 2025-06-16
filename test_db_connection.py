import os
import psycopg2
from dotenv import load_dotenv


# Carrega as variaveis do .env
load_dotenv()

# Pega a URL do banco
DATABASE_URL = os.getenv("DATABASE_URL")

# Testa a conexao
try:
    conn = psycopg2.connect(DATABASE_URL)
    print("Conexao bem sucedida")
    conn.close()
except Exception as e:
    print("Falha na conexao:", e)
