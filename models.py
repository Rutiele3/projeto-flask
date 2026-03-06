from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True)
    nome = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    senha = Column(String(100), nullable=False)

    consultas = relationship("Consulta", back_populates="usuario")

class Cliente(Base):
    __tablename__ = "clientes"
    id = Column(Integer, primary_key=True)
    nome = Column(String)
    cpf = Column(String(14))
    email = Column(String)
    telefone = Column(String)

    consultas = relationship("Consulta", back_populates="cliente")

class Medico(Base):
    __tablename__ = "medicos"
    
    id = Column(Integer, primary_key=True)
    nome = Column(String, nullable=False)
    especialidade = Column(String, nullable=False)
    crm = Column(String(7), nullable=False)

    consultas = relationship("Consulta", back_populates="medico")

class Consulta(Base):
    __tablename__ = "consultas"
    id = Column(Integer, primary_key=True)
    data_hora = Column(DateTime)
    status = Column(String(20), default="agendado")

    usuario_id = Column(Integer, ForeignKey("usuarios.id"))
    cliente_id = Column(Integer, ForeignKey("clientes.id"))
    medico_id = Column(Integer, ForeignKey("medicos.id"))

    usuario = relationship("Usuario", back_populates="consultas")
    cliente = relationship("Cliente", back_populates="consultas")
    medico = relationship("Medico", back_populates="consultas") 