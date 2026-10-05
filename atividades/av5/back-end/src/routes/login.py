from flask import Blueprint, jsonify, request

from src.routes.utils import erro_api
from src.services import pessoa as pessoa_service

login_bp = Blueprint("login", __name__)


@login_bp.post("/login")
def login():
    dados = request.get_json(silent=True)
    if not isinstance(dados, dict):
        return erro_api("Envie um objeto JSON com login e senha.", 400)

    login_enviado = dados.get("login")
    senha_enviada = dados.get("senha")
    if not isinstance(login_enviado, str) or not isinstance(senha_enviada, str):
        return erro_api("Login e senha são obrigatórios.", 400)

    pessoa, token = pessoa_service.gerar_token(login_enviado, senha_enviada)
    if pessoa is None or token is None:
        return erro_api("Login ou senha inválidos.", 401)

    return jsonify({"dados": {"token": token, "pessoa": pessoa.to_dict(incluir_contato=True)}})