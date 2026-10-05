from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

from src.routes.utils import erro_api
from src.services.errors import Conflito, ErroValidacao
from src.services import genero as genero_service

generos_bp = Blueprint("generos", __name__)


@generos_bp.get("/generos")
def listar_generos():
    return jsonify({"dados": [genero.to_dict() for genero in genero_service.listar_generos()]})


@generos_bp.post("/generos")
@jwt_required()
def criar_genero():
    try:
        genero = genero_service.criar_genero(request.get_json(silent=True))
    except ErroValidacao as erro:
        return erro_api(erro.mensagem, 400, erro.campos)
    except Conflito as erro:
        return erro_api(str(erro), 409)
    return jsonify({"dados": genero.to_dict()}), 201