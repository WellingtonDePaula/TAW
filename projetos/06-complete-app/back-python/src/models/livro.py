from config import *
class Livro(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(200), nullable=False)
    autores = db.Column(db.String(200), nullable=False)
    editora = db.Column(db.String(200), nullable=True)
    edicao = db.Column(db.Integer, nullable=False)
    ano = db.Column(db.Integer, nullable=False)

    def json(self):
        return {
            "id":self.id,
            "titulo":self.titulo,
            "autores":self.autores,
            "editora":self.editora,
            "edicao":self.edicao,
            "ano":self.ano
            }
