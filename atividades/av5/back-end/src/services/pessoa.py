import re

import bcrypt
from flask_jwt_extended import create_access_token
from sqlalchemy import func

from src.config import db
from src.models.pessoa import Pessoa
from src.services.errors import Conflito, ErroValidacao

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
LOGIN_RE = re.compile(r"^[a-zA-Z0-9._-]+$")


def listar_pessoas():
    return Pessoa.query.order_by(Pessoa.nome, Pessoa.id).all()


def criar_pessoa(dados):
    if not isinstance(dados, dict):
        raise ErroValidacao("Envie um objeto JSON.")

    erros = {}
    valores = {}
    for campo, limite in (("nome", 200), ("email", 254), ("login", 50), ("senha", 72)):
        valor = dados.get(campo)
        if not isinstance(valor, str) or not valor.strip():
            erros[campo] = "Campo obrigatório."
            continue
        valor_normalizado = valor if campo == "senha" else valor.strip()
        if len(valor_normalizado.encode("utf-8")) > limite:
            erros[campo] = f"O valor excede o limite de {limite} caracteres/bytes."
        else:
            valores[campo] = valor_normalizado

    telefone = dados.get("telefone")
    if telefone is not None:
        if not isinstance(telefone, str) or len(telefone.strip()) > 30:
            erros["telefone"] = "Informe um telefone de até 30 caracteres."
        else:
            valores["telefone"] = telefone.strip() or None
    else:
        valores["telefone"] = None

    if "email" in valores:
        valores["email"] = valores["email"].lower()
        if not EMAIL_RE.fullmatch(valores["email"]):
            erros["email"] = "Informe um endereço de e-mail válido."
    if "login" in valores:
        valores["login"] = valores["login"].lower()
        if not 3 <= len(valores["login"]) <= 50 or not LOGIN_RE.fullmatch(valores["login"]):
            erros["login"] = "Use de 3 a 50 letras, números, ponto, hífen ou sublinhado."
    if "senha" in valores and len(valores["senha"].encode("utf-8")) < 8:
        erros["senha"] = "A senha deve ter ao menos 8 bytes."
    if erros:
        raise ErroValidacao("Revise os dados da pessoa.", erros)

    email_existente = Pessoa.query.filter(func.lower(Pessoa.email) == valores["email"]).first()
    login_existente = Pessoa.query.filter(func.lower(Pessoa.login) == valores["login"]).first()
    if email_existente or login_existente:
        raise Conflito("Já existe uma pessoa com esse e-mail ou login.")

    senha_hash = bcrypt.hashpw(valores["senha"].encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    pessoa = Pessoa(
        nome=valores["nome"],
        email=valores["email"],
        telefone=valores["telefone"],
        login=valores["login"],
        senha_hash=senha_hash,
    )
    db.session.add(pessoa)
    db.session.commit()
    return pessoa


def gerar_token(login, senha):
    if len(senha.encode("utf-8")) > 72:
        return None, None
    pessoa = Pessoa.query.filter(func.lower(Pessoa.login) == login.strip().lower()).first()
    if pessoa is None:
        return None, None

    senha_valida = bcrypt.checkpw(senha.encode("utf-8"), pessoa.senha_hash.encode("utf-8"))
    if not senha_valida:
        return None, None

    return pessoa, create_access_token(identity=str(pessoa.id))