from decimal import Decimal, InvalidOperation
from urllib.parse import urlsplit

from sqlalchemy import func

from src.config import db
from src.models.genero import Genero
from src.models.jogo import Jogo
from src.services.errors import ErroValidacao

CENTAVO = Decimal("0.01")
VALOR_MAXIMO = Decimal("99999999.99")
CAMPOS_TEXTO = {
    "nome": (200, True),
    "descricao": (20000, True),
    "banner": (2048, True),
    "distribuidora": (200, True),
    "desenvolvedora": (200, True),
}
CAMPOS_PERMITIDOS = set(CAMPOS_TEXTO) | {"preco_base", "preco_ofertado", "generos"}


def listar_jogos():
    return Jogo.query.order_by(Jogo.nome, Jogo.id).all()


def obter_jogo(jogo_id):
    return db.session.get(Jogo, jogo_id)


def _validar_preco(valor, campo, obrigatorio, erros):
    if valor is None or valor == "":
        if obrigatorio:
            erros[campo] = "Informe um valor maior que zero."
        return None
    if isinstance(valor, bool):
        erros[campo] = "Informe um valor monetário válido."
        return None

    try:
        preco = Decimal(str(valor))
    except (InvalidOperation, ValueError, TypeError):
        erros[campo] = "Informe um valor monetário válido."
        return None

    if not preco.is_finite() or preco <= 0 or preco > VALOR_MAXIMO:
        erros[campo] = "O valor deve ser positivo e ter no máximo duas casas decimais."
        return None
    try:
        if preco != preco.quantize(CENTAVO):
            erros[campo] = "O valor deve ter no máximo duas casas decimais."
            return None
    except InvalidOperation:
        erros[campo] = "Informe um valor monetário válido."
        return None
    return preco


def _validar_banner(valor):
    if valor.startswith("/"):
        return not valor.startswith("//")
    partes = urlsplit(valor)
    return partes.scheme in {"http", "https"} and bool(partes.netloc)


def _normalizar_dados(dados, jogo_atual=None, parcial=False):
    if not isinstance(dados, dict):
        raise ErroValidacao("Envie um objeto JSON.")

    erros = {}
    desconhecidos = set(dados) - CAMPOS_PERMITIDOS
    if desconhecidos:
        erros.update({campo: "Campo não permitido." for campo in desconhecidos})

    normalizados = {}
    for campo, (limite, obrigatorio) in CAMPOS_TEXTO.items():
        if campo not in dados:
            if not parcial:
                erros[campo] = "Campo obrigatório."
            continue
        valor = dados[campo]
        if not isinstance(valor, str):
            erros[campo] = "Informe um texto."
            continue
        valor = valor.strip()
        if not valor:
            erros[campo] = "Campo obrigatório."
        elif len(valor) > limite:
            erros[campo] = f"O valor excede {limite} caracteres."
        elif campo == "banner" and not _validar_banner(valor):
            erros[campo] = "Informe uma URL HTTP(S) ou um caminho local iniciado por '/'."
        else:
            normalizados[campo] = valor

    if "preco_base" in dados:
        preco_base = _validar_preco(dados["preco_base"], "preco_base", True, erros)
        if preco_base is not None:
            normalizados["preco_base"] = preco_base
    elif not parcial:
        erros["preco_base"] = "Campo obrigatório."

    if "preco_ofertado" in dados:
        normalizados["preco_ofertado"] = _validar_preco(
            dados["preco_ofertado"], "preco_ofertado", False, erros
        )
    elif not parcial:
        normalizados["preco_ofertado"] = None

    if "generos" in dados:
        ids = dados["generos"]
        if (
            not isinstance(ids, list)
            or not ids
            or any(not isinstance(genero_id, int) or isinstance(genero_id, bool) or genero_id <= 0 for genero_id in ids)
        ):
            erros["generos"] = "Informe uma lista não vazia de identificadores positivos."
        elif len(set(ids)) != len(ids):
            erros["generos"] = "A lista contém gêneros duplicados."
        else:
            generos = Genero.query.filter(Genero.id.in_(ids)).all()
            if len(generos) != len(ids):
                erros["generos"] = "Um ou mais gêneros não existem."
            else:
                normalizados["generos"] = generos
    elif not parcial:
        erros["generos"] = "Campo obrigatório; informe ao menos um gênero."

    preco_base_final = normalizados.get(
        "preco_base", jogo_atual.preco_base if jogo_atual is not None else None
    )
    preco_ofertado_final = normalizados.get(
        "preco_ofertado", jogo_atual.preco_ofertado if jogo_atual is not None else None
    )
    if (
        preco_base_final is not None
        and preco_ofertado_final is not None
        and preco_ofertado_final >= preco_base_final
    ):
        erros["preco_ofertado"] = "O preço ofertado deve ser menor que o preço base."

    if erros:
        raise ErroValidacao("Revise os campos informados.", erros)
    return normalizados


def criar_jogo(dados):
    valores = _normalizar_dados(dados)
    jogo = Jogo(**valores)
    db.session.add(jogo)
    db.session.commit()
    return jogo


def atualizar_jogo(jogo, dados, parcial=False):
    valores = _normalizar_dados(dados, jogo_atual=jogo, parcial=parcial)
    for campo, valor in valores.items():
        setattr(jogo, campo, valor)
    db.session.commit()
    return jogo


def excluir_jogo(jogo):
    db.session.delete(jogo)
    db.session.commit()