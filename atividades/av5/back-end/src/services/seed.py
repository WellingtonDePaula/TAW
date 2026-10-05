import bcrypt
from sqlalchemy import func

from src.config import db
from src.models.genero import Genero
from src.models.jogo import Jogo
from src.models.pessoa import Pessoa

TEST_USER = {
    "nome": "Usuario de Teste",
    "email": "teste@example.com",
    "login": "teste",
    "senha": "teste1234",
    "telefone": "0000000000",
}

SEED_GAMES = [
    {
        "nome": "Starlight Courier",
        "descricao": "Uma aventura espacial sobre entregas entre mundos distantes.",
        "banner": "https://placehold.co/1200x500?text=Starlight+Courier",
        "preco_base": "89.90",
        "preco_ofertado": "69.90",
        "generos": ("Aventura", "Ficcao cientifica"),
        "distribuidora": "Orbit House",
        "desenvolvedora": "Comet Studio",
    },
    {
        "nome": "Kingdoms of Ash",
        "descricao": "Explore ruinas antigas e reconstrua um reino de fantasia.",
        "banner": "https://placehold.co/1200x500?text=Kingdoms+of+Ash",
        "preco_base": "119.90",
        "preco_ofertado": None,
        "generos": ("RPG", "Aventura"),
        "distribuidora": "Northstar Publishing",
        "desenvolvedora": "Ember Forge",
    },
    {
        "nome": "Neon Circuit",
        "descricao": "Corridas arcade em circuitos urbanos iluminados por neon.",
        "banner": "https://placehold.co/1200x500?text=Neon+Circuit",
        "preco_base": "49.90",
        "preco_ofertado": "34.90",
        "generos": ("Corrida", "Acao"),
        "distribuidora": "Pixel Drive",
        "desenvolvedora": "Voltage Games",
    },
]


def popular_dados_teste():
    generos_por_nome = {}
    generos_criados = 0
    for jogo_dados in SEED_GAMES:
        for nome in jogo_dados["generos"]:
            genero = Genero.query.filter(func.lower(Genero.nome) == nome.lower()).first()
            if genero is None:
                genero = Genero(nome=nome)
                db.session.add(genero)
                generos_criados += 1
            generos_por_nome[nome] = genero

    db.session.flush()

    jogos_criados = 0
    for jogo_dados in SEED_GAMES:
        jogo = Jogo.query.filter_by(nome=jogo_dados["nome"]).first()
        if jogo is not None:
            continue

        jogo = Jogo(
            nome=jogo_dados["nome"],
            descricao=jogo_dados["descricao"],
            banner=jogo_dados["banner"],
            preco_base=jogo_dados["preco_base"],
            preco_ofertado=jogo_dados["preco_ofertado"],
            distribuidora=jogo_dados["distribuidora"],
            desenvolvedora=jogo_dados["desenvolvedora"],
            generos=[generos_por_nome[nome] for nome in jogo_dados["generos"]],
        )
        db.session.add(jogo)
        jogos_criados += 1

    pessoa = Pessoa.query.filter(func.lower(Pessoa.login) == TEST_USER["login"]).first()
    if pessoa is None:
        pessoa = Pessoa(
            nome=TEST_USER["nome"],
            email=TEST_USER["email"],
            telefone=TEST_USER["telefone"],
            login=TEST_USER["login"],
            senha_hash="",
        )
        db.session.add(pessoa)
    pessoa.nome = TEST_USER["nome"]
    pessoa.email = TEST_USER["email"]
    pessoa.telefone = TEST_USER["telefone"]
    pessoa.senha_hash = bcrypt.hashpw(
        TEST_USER["senha"].encode("utf-8"), bcrypt.gensalt()
    ).decode("utf-8")

    db.session.commit()
    return {
        "generos": generos_criados,
        "jogos": jogos_criados,
        "login": TEST_USER["login"],
    }