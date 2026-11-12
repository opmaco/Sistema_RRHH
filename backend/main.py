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
# ENDPOINTS: CATALOGOS
# ==========================================

@app.get(
    "/api/niveles-salariales",
    response_model=List[schemas.NivelSalarialResponse],
    tags=["Niveles Salariales"]
)
def listar_niveles_salariales(db: Session = Depends(get_db)):
    return db.query(models.NivelSalarial).all()


@app.get(
    "/api/regionales",
    response_model=List[schemas.RegionalResponse],
    tags=["Regionales"]
)
def listar_regionales(db: Session = Depends(get_db)):
    return db.query(models.Regional).all()


@app.get(
    "/api/direcciones",
    response_model=List[schemas.DireccionResponse],
    tags=["Direcciones"]
)
def listar_direcciones(db: Session = Depends(get_db)):
    return db.query(models.Direccion).all()


@app.get(
    "/api/unidades-ejecutoras",
    response_model=List[schemas.UnidadEjecutoraResponse],
    tags=["Unidades Ejecutoras"]
)
def listar_unidades_ejecutoras(db: Session = Depends(get_db)):
    return db.query(models.UnidadEjecutora).all()


@app.get(
    "/api/procesos",
    response_model=List[schemas.ProcesoResponse],
    tags=["Procesos"]
)
def listar_procesos(db: Session = Depends(get_db)):
    return db.query(models.Proceso).all()


@app.get(
    "/api/fuentes",
    response_model=List[schemas.FuenteResponse],
    tags=["Fuentes de Financiamiento"]
)
def listar_fuentes(db: Session = Depends(get_db)):
    return db.query(models.Fuente).all()

    # ==========================================
# POST: CATALOGOS
# ==========================================

@app.post(
    "/api/niveles-salariales",
    response_model=schemas.NivelSalarialResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Niveles Salariales"]
)
def crear_nivel_salarial(
    nivel: schemas.NivelSalarialCreate,
    db: Session = Depends(get_db)
):
    nuevo = models.NivelSalarial(**nivel.model_dump())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo


@app.post(
    "/api/regionales",
    response_model=schemas.RegionalResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Regionales"]
)
def crear_regional(
    regional: schemas.RegionalCreate,
    db: Session = Depends(get_db)
):
    nuevo = models.Regional(**regional.model_dump())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo


@app.post(
    "/api/direcciones",
    response_model=schemas.DireccionResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Direcciones"]
)
def crear_direccion(
    direccion: schemas.DireccionCreate,
    db: Session = Depends(get_db)
):
    nuevo = models.Direccion(**direccion.model_dump())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo


@app.post(
    "/api/unidades-ejecutoras",
    response_model=schemas.UnidadEjecutoraResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Unidades Ejecutoras"]
)
def crear_unidad_ejecutora(
    unidad: schemas.UnidadEjecutoraCreate,
    db: Session = Depends(get_db)
):
    nuevo = models.UnidadEjecutora(**unidad.model_dump())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo


@app.post(
    "/api/procesos",
    response_model=schemas.ProcesoResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Procesos"]
)
def crear_proceso(
    proceso: schemas.ProcesoCreate,
    db: Session = Depends(get_db)
):
    nuevo = models.Proceso(**proceso.model_dump())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo


@app.post(
    "/api/fuentes",
    response_model=schemas.FuenteResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Fuentes de Financiamiento"]
)
def crear_fuente(
    fuente: schemas.FuenteCreate,
    db: Session = Depends(get_db)
):
    nuevo = models.Fuente(**fuente.model_dump())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo


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

