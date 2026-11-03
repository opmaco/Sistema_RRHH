import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Cargar variables de entorno
load_dotenv()

# Obtener la dirección de conexión de Supabase
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise RuntimeError("No se encontró DATABASE_URL en el archivo .env")

# Crear conexión con PostgreSQL
engine = create_engine(DATABASE_URL)

# Crear sesiones para trabajar con la base de datos
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base para los modelos
Base = declarative_base()

# ==========================================
# FUNCION PARA ADMINISTRAR SESIONES
# ==========================================

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
