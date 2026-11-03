from sqlalchemy import (
    Column,
    BigInteger,
    Integer,
    SmallInteger,
    Text,
    Boolean,
    Date,
    ForeignKey,
    text
)
from sqlalchemy.orm import relationship

from backend.database import Base


# ==========================================
# TABLA: PERSONA
# ==========================================
class Persona(Base):
    __tablename__ = "persona"

    idpersona = Column(BigInteger, primary_key=True)
    ci = Column(Text, nullable=False)
    appaterno = Column(Text, nullable=True)
    apmaterno = Column(Text, nullable=True)
    pnombre = Column(Text, nullable=True)
    snombre = Column(Text, nullable=True)
    fechanac = Column(Date, nullable=False)
    celular = Column(BigInteger, nullable=True)
    correo = Column(Text, nullable=True)
    domicilio = Column(Text, nullable=True)
    sexo = Column(Text, nullable=False)
    lugarnac = Column(Text, nullable=True)

    contratos = relationship("Contrato", back_populates="persona")


# ==========================================
# TABLA: CARGO
# ==========================================
class Cargo(Base):
    __tablename__ = "cargo"

    idcargo = Column(BigInteger, primary_key=True)
    cargo = Column(Text, nullable=False)
    codigo = Column(Text, nullable=True)
    descripcion = Column(Text, nullable=False)
    nivel = Column(Integer, nullable=False)
    estado = Column(Boolean, nullable=False, server_default=text("false"))

    contratos = relationship("Contrato", back_populates="cargo")


# ==========================================
# TABLA: NIVEL SALARIAL
# ==========================================
class NivelSalarial(Base):
    __tablename__ = "nivel_salarial"

    idnivel_salarial = Column(BigInteger, primary_key=True)
    categoria = Column(Text, nullable=False)
    clase = Column(SmallInteger, nullable=False)
    nivel = Column(SmallInteger, nullable=False)
    cargo = Column(Text, nullable=False)
    sueldo = Column(BigInteger, nullable=False)
    estado = Column(Boolean, nullable=False, server_default=text("true"))

    contratos = relationship("Contrato", back_populates="nivel_salarial")


# ==========================================
# TABLA: REGIONAL
# ==========================================
class Regional(Base):
    __tablename__ = "regional"

    idregional = Column(BigInteger, primary_key=True)
    regional = Column(Text, nullable=False)
    codigo = Column(Text, nullable=False)

    direcciones = relationship("Direccion", back_populates="regional")


# ==========================================
# TABLA: DIRECCION
# ==========================================
class Direccion(Base):
    __tablename__ = "direccion"

    iddireccion = Column(BigInteger, primary_key=True)
    idregional = Column(
        BigInteger,
        ForeignKey("regional.idregional"),
        nullable=False
    )
    direccion = Column(Text, nullable=False)
    codigo = Column(Text, nullable=True)
    orden = Column(Integer, nullable=True)

    regional = relationship("Regional", back_populates="direcciones")
    unidades = relationship("UnidadEjecutora", back_populates="direccion")


# ==========================================
# TABLA: UNIDAD EJECUTORA
# ==========================================
class UnidadEjecutora(Base):
    __tablename__ = "unidadejecutora"

    idunidadejecutora = Column(BigInteger, primary_key=True)
    iddireccion = Column(
        BigInteger,
        ForeignKey("direccion.iddireccion"),
        nullable=False
    )
    unidadejecutora = Column(Text, nullable=False)
    codigo = Column(Integer, nullable=True)
    gestion = Column(Integer, nullable=False)
    orden = Column(Integer, nullable=True)

    direccion = relationship("Direccion", back_populates="unidades")
    contratos = relationship("Contrato", back_populates="unidad_ejecutora")


# ==========================================
# TABLA: PROCESO
# ==========================================
class Proceso(Base):
    __tablename__ = "proceso"

    idproceso = Column(BigInteger, primary_key=True)
    proceso = Column(Text, nullable=False)
    codigo = Column(Text, nullable=False)
    tipo_proceso = Column(Text, nullable=False)
    idregional = Column(BigInteger, nullable=False)
    estado = Column(Boolean, nullable=False, server_default=text("true"))
    observacion = Column(Text, nullable=True)

    contratos = relationship("Contrato", back_populates="proceso")


# ==========================================
# TABLA: FUENTE
# ==========================================
class Fuente(Base):
    __tablename__ = "fuente"

    idfuente = Column(BigInteger, primary_key=True)
    fuente = Column(Text, nullable=False)
    sigla = Column(Text, nullable=True)
    codigo = Column(Text, nullable=False)

    contratos = relationship("Contrato", back_populates="fuente")


# ==========================================
# TABLA: CONTRATO
# ==========================================
class Contrato(Base):
    __tablename__ = "contrato"

    idcontrato = Column(BigInteger, primary_key=True)

    idpersona = Column(
        BigInteger,
        ForeignKey("persona.idpersona"),
        nullable=False
    )
    idcargo = Column(
        BigInteger,
        ForeignKey("cargo.idcargo"),
        nullable=False
    )
    idnivel_salarial = Column(
        BigInteger,
        ForeignKey("nivel_salarial.idnivel_salarial"),
        nullable=False
    )

    # Estos dos campos no tienen FK en Supabase actualmente
    idregional = Column(BigInteger, nullable=False)
    iddireccion = Column(BigInteger, nullable=False)

    idunidad_ejecutora = Column(
        BigInteger,
        ForeignKey("unidadejecutora.idunidadejecutora"),
        nullable=False
    )
    idproceso = Column(
        BigInteger,
        ForeignKey("proceso.idproceso"),
        nullable=False
    )
    idfuente = Column(
        BigInteger,
        ForeignKey("fuente.idfuente"),
        nullable=False
    )

    fecha_ini = Column(Date, nullable=False)
    fecha_fin = Column(Date, nullable=False)
    condicion = Column(Text, nullable=False)
    estado = Column(SmallInteger, nullable=False)
    fecha_baja = Column(Date, nullable=True)
    motivo_baja = Column(Text, nullable=True)
    numcontrato = Column(Text, nullable=True)
    observaciones = Column(Text, nullable=True)

    persona = relationship("Persona", back_populates="contratos")
    cargo = relationship("Cargo", back_populates="contratos")
    nivel_salarial = relationship(
        "NivelSalarial",
        back_populates="contratos"
    )
    unidad_ejecutora = relationship(
        "UnidadEjecutora",
        back_populates="contratos"
    )
    proceso = relationship("Proceso", back_populates="contratos")
    fuente = relationship("Fuente", back_populates="contratos")