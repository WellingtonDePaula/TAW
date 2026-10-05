from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

from src.routes.utils import erro_api
from src.services.errors import ErroValidacao
from src.services import jogo as jogo_service

jogos_bp = Blueprint("jogos", __name__)


@jogos_bp.get("/jogos")
def listar_jogos():
    return jsonify({"dados": [jogo.to_dict() for jogo in jogo_service.listar_jogos()]})


@jogos_bp.get("/jogos/<int:jogo_id>")
def obter_jogo(jogo_id):
    jogo = jogo_service.obter_jogo(jogo_id)
    if jogo is None:
        return erro_api("Jogo não encontrado.", 404)
    return jsonify({"dados": jogo.to_dict()})


@jogos_bp.post("/jogos")
@jwt_required()
def criar_jogo():
    try:
        jogo = jogo_service.criar_jogo(request.get_json(silent=True))
    except ErroValidacao as erro:
        return erro_api(erro.mensagem, 400, erro.campos)
    return jsonify({"dados": jogo.to_dict()}), 201


@jogos_bp.put("/jogos/<int:jogo_id>")
@jwt_required()
def substituir_jogo(jogo_id):
    return _atualizar(jogo_id, parcial=False)


@jogos_bp.patch("/jogos/<int:jogo_id>")
@jwt_required()
def atualizar_jogo(jogo_id):
    return _atualizar(jogo_id, parcial=True)


def _atualizar(jogo_id, parcial):
    jogo = jogo_service.obter_jogo(jogo_id)
    if jogo is None:
        return erro_api("Jogo não encontrado.", 404)
    try:
        jogo = jogo_service.atualizar_jogo(
            jogo,
            request.get_json(silent=True),
            parcial=parcial,
        )
    except ErroValidacao as erro:
        return erro_api(erro.mensagem, 400, erro.campos)
    return jsonify({"dados": jogo.to_dict()})


@jogos_bp.delete("/jogos/<int:jogo_id>")
@jwt_required()
def excluir_jogo(jogo_id):
    jogo = jogo_service.obter_jogo(jogo_id)
    if jogo is None:
        return erro_api("Jogo não encontrado.", 404)
    jogo_service.excluir_jogo(jogo)
    return "", 204