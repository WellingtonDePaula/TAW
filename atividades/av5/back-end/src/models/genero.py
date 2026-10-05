from sqlalchemy import Column, ForeignKey, Integer, String, Table
from sqlalchemy.orm import relationship

from src.config import db

jogos_generos = Table(
    "jogos_generos",
    db.metadata,
    Column("jogo_id", Integer, ForeignKey("jogos.id", ondelete="CASCADE"), primary_key=True),
    Column("genero_id", Integer, ForeignKey("generos.id", ondelete="CASCADE"), primary_key=True),
)


class Genero(db.Model):
    __tablename__ = "generos"

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False, unique=True)
    jogos = relationship("Jogo", secondary=jogos_generos, back_populates="generos")

    def to_dict(self):
        return {"id": self.id, "nome": self.nome}