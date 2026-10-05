from flask import jsonify


def erro_api(mensagem, status, campos=None):
    erro = {"mensagem": mensagem}
    if campos:
        erro["campos"] = campos
    return jsonify({"erro": erro}), status