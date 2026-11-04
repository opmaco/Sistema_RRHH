from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from backend import models, schemas
from backend.database import get_db


# ==========================================
# CONFIGURACION DE FASTAPI
# ==========================================

app = FastAPI(
    title="Sistema de Recursos Humanos",
    description="API para la gestion de personas, cargos y contratos",
    version="1.0.0"
)


# ==========================================
# CONFIGURACION CORS
# ==========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================
# ENDPOINT INICIAL
# ==========================================

@app.get("/", tags=["Inicio"])
def inicio():
    return {
        "mensaje": "API del Sistema RRHH funcionando correctamente",
        "institucion": "INRA"
    }


# ==========================================
# ENDPOINTS: PERSONAS
# ==========================================

@app.get(
    "/api/personas",
    response_model=List[schemas.PersonaResponse],
    tags=["Personas"]
)
def listar_personas(db: Session = Depends(get_db)):
    return db.query(models.Persona).all()


@app.post(
    "/api/personas",
    response_model=schemas.PersonaResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Personas"]
)
def crear_persona(
    persona: schemas.PersonaCreate,
    db: Session = Depends(get_db)
):
    existente = db.query(models.Persona).filter(
        models.Persona.ci == persona.ci
    ).first()

    if existente:
        raise HTTPException(
            status_code=400,
            detail="Ya existe una persona con ese CI"
        )

    nueva_persona = models.Persona(**persona.model_dump())

    db.add(nueva_persona)
    db.commit()
    db.refresh(nueva_persona)

    return nueva_persona


# ==========================================
# ENDPOINTS: CARGOS
# ==========================================

@app.get(
    "/api/cargos",
    response_model=List[schemas.CargoResponse],
    tags=["Cargos"]
)
def listar_cargos(db: Session = Depends(get_db)):
    return db.query(models.Cargo).all()


@app.post(
    "/api/cargos",
    response_model=schemas.CargoResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Cargos"]
)
def crear_cargo(
    cargo: schemas.CargoCreate,
    db: Session = Depends(get_db)
):
    nuevo_cargo = models.Cargo(**cargo.model_dump())

    db.add(nuevo_cargo)
    db.commit()
    db.refresh(nuevo_cargo)

    return nuevo_cargo


# ==========================================
# ENDPOINTS: CONTRATOS
# ==========================================

@app.get(
    "/api/contratos",
    response_model=List[schemas.ContratoResponse],
    tags=["Contratos"]
)
def listar_contratos(db: Session = Depends(get_db)):
    return db.query(models.Contrato).all()


@app.post(
    "/api/contratos",
    response_model=schemas.ContratoResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Contratos"]
)
def crear_contrato(
    contrato: schemas.ContratoCreate,
    db: Session = Depends(get_db)
):
    nuevo_contrato = models.Contrato(**contrato.model_dump())

    db.add(nuevo_contrato)
    db.commit()
    db.refresh(nuevo_contrato)

    return nuevo_contrato