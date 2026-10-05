from src.config import db


class Pessoa(db.Model):
    __tablename__ = "pessoas"

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(254), nullable=False, unique=True)
    telefone = db.Column(db.String(30), nullable=True)
    login = db.Column(db.String(50), nullable=False, unique=True)
    senha_hash = db.Column(db.String(255), nullable=False)

    def to_dict(self, incluir_contato=False):
        dados = {
            "id": self.id,
            "nome": self.nome,
            "login": self.login,
        }
        if incluir_contato:
            dados.update({"email": self.email, "telefone": self.telefone})
        return dados