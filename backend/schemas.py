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