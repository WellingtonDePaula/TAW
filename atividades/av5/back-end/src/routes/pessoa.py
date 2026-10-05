from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

from src.routes.utils import erro_api
from src.services import pessoa as pessoa_service
from src.services.errors import Conflito, ErroValidacao

pessoas_bp = Blueprint("pessoas", __name__)


@pessoas_bp.get("/pessoas")
@jwt_required()
def listar_pessoas():
    return jsonify({"dados": [pessoa.to_dict() for pessoa in pessoa_service.listar_pessoas()]})


@pessoas_bp.post("/pessoas")
def criar_pessoa():
    try:
        pessoa = pessoa_service.criar_pessoa(request.get_json(silent=True))
    except ErroValidacao as erro:
        return erro_api(erro.mensagem, 400, erro.campos)
    except Conflito as erro:
        return erro_api(str(erro), 409)
    return jsonify({"dados": pessoa.to_dict(incluir_contato=True)}), 201