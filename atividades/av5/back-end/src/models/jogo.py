from src.config import db
from src.models.genero import Genero, jogos_generos


class Jogo(db.Model):
    __tablename__ = "jogos"

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(200), nullable=False)
    descricao = db.Column(db.Text, nullable=False)
    banner = db.Column(db.String(2048), nullable=False)
    preco_base = db.Column(db.Numeric(10, 2), nullable=False)
    preco_ofertado = db.Column(db.Numeric(10, 2), nullable=True)
    distribuidora = db.Column(db.String(200), nullable=False)
    desenvolvedora = db.Column(db.String(200), nullable=False)
    generos = db.relationship(
        "Genero",
        secondary=jogos_generos,
        back_populates="jogos",
        lazy="selectin",
    )

    def to_dict(self):
        return {
            "id": self.id,
            "nome": self.nome,
            "descricao": self.descricao,
            "banner": self.banner,
            "preco_base": format(self.preco_base, ".2f"),
            "preco_ofertado": (
                format(self.preco_ofertado, ".2f") if self.preco_ofertado is not None else None
            ),
            "generos": [genero.to_dict() for genero in sorted(self.generos, key=lambda item: item.nome.casefold())],
            "distribuidora": self.distribuidora,
            "desenvolvedora": self.desenvolvedora,
        }