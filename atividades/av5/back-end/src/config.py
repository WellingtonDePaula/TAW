import os
import secrets
from datetime import timedelta
from pathlib import Path

from flask import Flask, jsonify
import click
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from werkzeug.exceptions import HTTPException
from sqlalchemy.exc import IntegrityError, SQLAlchemyError

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()


def create_app(test_config=None):
    app = Flask(__name__)
    database_url = os.getenv("DATABASE_URL") or os.getenv("POSTGRES_URL_NON_POOLING")

    if database_url and database_url.startswith("postgres://"):
        database_url = database_url.replace("postgres://", "postgresql+psycopg2://", 1)
    if not database_url:
        database_dir = Path(__file__).resolve().parent / "database"
        database_dir.mkdir(parents=True, exist_ok=True)
        database_url = f"sqlite:///{database_dir / 'jogos.db'}"

    app.config.update(
        SQLALCHEMY_DATABASE_URI=database_url,
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
        JWT_SECRET_KEY=os.getenv("JWT_SECRET_KEY") or secrets.token_urlsafe(48),
        JWT_ACCESS_TOKEN_EXPIRES=timedelta(hours=1),
    )
    if test_config:
        app.config.update(test_config)

    allowed_origins = os.getenv("CORS_ORIGINS", "*").split(",")
    CORS(app, resources={r"/*": {"origins": [origin.strip() for origin in allowed_origins]}})
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    from src.routes.genero import generos_bp
    from src.routes.jogo import jogos_bp
    from src.routes.login import login_bp
    from src.routes.pessoa import pessoas_bp

    app.register_blueprint(login_bp)
    app.register_blueprint(pessoas_bp)
    app.register_blueprint(jogos_bp)
    app.register_blueprint(generos_bp)

    @app.cli.command("seed-dados-teste")
    def seed_dados_teste():
        from src.services.seed import popular_dados_teste

        resultado = popular_dados_teste()
        click.echo(
            "Carga de teste concluída: "
            f"{resultado['generos']} gêneros, {resultado['jogos']} jogos; "
            f"login de teste: {resultado['login']}"
        )

    @app.get("/")
    def index():
        return jsonify({"status": "ok", "servico": "api-jogos"})

    @app.errorhandler(IntegrityError)
    def handle_integrity_error(error):
        db.session.rollback()
        return jsonify({"erro": {"mensagem": "Registro duplicado ou relacionado a outros dados."}}), 409

    @app.errorhandler(SQLAlchemyError)
    def handle_database_error(error):
        db.session.rollback()
        app.logger.exception("Falha ao acessar o banco de dados")
        return jsonify({"erro": {"mensagem": "Não foi possível concluir a operação."}}), 500

    @app.errorhandler(HTTPException)
    def handle_http_error(error):
        return jsonify({"erro": {"mensagem": error.description}}), error.code

    @app.errorhandler(Exception)
    def handle_unexpected_error(error):
        app.logger.exception("Erro não tratado na API")
        return jsonify({"erro": {"mensagem": "Ocorreu um erro interno."}}), 500

    @jwt.unauthorized_loader
    def handle_missing_token(_reason):
        return jsonify({"erro": {"mensagem": "Autenticação necessária."}}), 401

    @jwt.invalid_token_loader
    def handle_invalid_token(_reason):
        return jsonify({"erro": {"mensagem": "Token inválido."}}), 401

    @jwt.expired_token_loader
    def handle_expired_token(_header, _payload):
        return jsonify({"erro": {"mensagem": "Token expirado."}}), 401

    return app
