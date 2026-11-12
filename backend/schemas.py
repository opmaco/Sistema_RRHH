from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import date


# ==========================================
# ESQUEMAS: PERSONA
# ==========================================

class PersonaBase(BaseModel):
    ci: str
    appaterno: Optional[str] = None
    apmaterno: Optional[str] = None
    pnombre: Optional[str] = None
    snombre: Optional[str] = None
    fechanac: date
    celular: Optional[int] = None
    correo: Optional[str] = None
    domicilio: Optional[str] = None
    sexo: str
    lugarnac: Optional[str] = None


class PersonaCreate(PersonaBase):
    pass


class PersonaResponse(PersonaBase):
    idpersona: int

    model_config = ConfigDict(from_attributes=True)


# ==========================================
# ESQUEMAS: CARGO
# ==========================================

class CargoBase(BaseModel):
    cargo: str
    codigo: Optional[str] = None
    descripcion: str
    nivel: int
    estado: bool = False


class CargoCreate(CargoBase):
    pass


class CargoResponse(CargoBase):
    idcargo: int

    model_config = ConfigDict(from_attributes=True)


# ==========================================
# ESQUEMAS: CONTRATO
# ==========================================

class ContratoBase(BaseModel):
    idpersona: int
    idcargo: int
    idnivel_salarial: int
    idregional: int
    iddireccion: int
    idunidad_ejecutora: int
    idproceso: int
    idfuente: int
    fecha_ini: date
    fecha_fin: date
    condicion: str
    estado: int
    fecha_baja: Optional[date] = None
    motivo_baja: Optional[str] = None
    numcontrato: Optional[str] = None
    observaciones: Optional[str] = None


class ContratoCreate(ContratoBase):
    pass


class ContratoResponse(ContratoBase):
    idcontrato: int

    model_config = ConfigDict(from_attributes=True)

    # ==========================================
# ESQUEMAS: NIVEL SALARIAL
# ==========================================

class NivelSalarialResponse(BaseModel):
    idnivel_salarial: int
    categoria: str
    clase: int
    nivel: int
    cargo: str
    sueldo: int
    estado: bool

    model_config = ConfigDict(from_attributes=True)


# ==========================================
# ESQUEMAS: REGIONAL
# ==========================================

class RegionalResponse(BaseModel):
    idregional: int
    regional: str
    codigo: str

    model_config = ConfigDict(from_attributes=True)


# ==========================================
# ESQUEMAS: DIRECCION
# ==========================================

class DireccionResponse(BaseModel):
    iddireccion: int
    idregional: int
    direccion: str
    codigo: Optional[str] = None
    orden: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)


# ==========================================
# ESQUEMAS: UNIDAD EJECUTORA
# ==========================================

class UnidadEjecutoraResponse(BaseModel):
    idunidadejecutora: int
    iddireccion: int
    unidadejecutora: str
    codigo: Optional[int] = None
    gestion: int
    orden: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)


# ==========================================
# ESQUEMAS: PROCESO
# ==========================================

class ProcesoResponse(BaseModel):
    idproceso: int
    proceso: str
    codigo: str
    tipo_proceso: str
    idregional: int
    estado: bool
    observacion: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


# ==========================================
# ESQUEMAS: FUENTE
# ==========================================

class FuenteResponse(BaseModel):
    idfuente: int
    fuente: str
    sigla: Optional[str] = None
    codigo: str

    model_config = ConfigDict(from_attributes=True)

    # ==========================================
# ESQUEMAS DE CREACION: CATALOGOS
# ==========================================

class NivelSalarialCreate(BaseModel):
    categoria: str
    clase: int
    nivel: int
    cargo: str
    sueldo: int
    estado: bool = True


class RegionalCreate(BaseModel):
    regional: str
    codigo: str


class DireccionCreate(BaseModel):
    idregional: int
    direccion: str
    codigo: Optional[str] = None
    orden: Optional[int] = None


class UnidadEjecutoraCreate(BaseModel):
    iddireccion: int
    unidadejecutora: str
    codigo: Optional[int] = None
    gestion: int
    orden: Optional[int] = None


class ProcesoCreate(BaseModel):
    proceso: str
    codigo: str
    tipo_proceso: str
    idregional: int
    estado: bool = True
    observacion: Optional[str] = None


class FuenteCreate(BaseModel):
    fuente: str
    sigla: Optional[str] = None
    codigo: str