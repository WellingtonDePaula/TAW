from sqlalchemy import func

from src.config import db
from src.models.genero import Genero
from src.services.errors import Conflito, ErroValidacao


def listar_generos():
    return Genero.query.order_by(func.lower(Genero.nome), Genero.id).all()


def criar_genero(dados):
    if not isinstance(dados, dict):
        raise ErroValidacao("Envie um objeto JSON.")

    nome = dados.get("nome")
    if not isinstance(nome, str) or not nome.strip():
        raise ErroValidacao("Informe o nome do gênero.", {"nome": "Campo obrigatório."})

    nome = nome.strip()
    if len(nome) > 100:
        raise ErroValidacao("O nome do gênero excede 100 caracteres.", {"nome": "Valor muito longo."})

    existente = Genero.query.filter(func.lower(Genero.nome) == nome.lower()).first()
    if existente:
        raise Conflito("Já existe um gênero com esse nome.")

    genero = Genero(nome=nome)
    db.session.add(genero)
    db.session.commit()
    return genero