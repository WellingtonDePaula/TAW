from config import *
from models.livro import Livro

def criar_livro(data):
    # criar a livro
    livro = Livro(
        titulo=data['titulo'],
        autores=data['autores'],
        editora=data.get('editora'),
        edicao=data['edicao'],
        ano_publicacao=data['ano_publicacao']
    )
    
    # salvar no banco de dados
    db.session.add(livro)
    db.session.commit()
    
    return livro

def retornar_livros():
    # buscar todas as pessoas no 
    # banco de dados
    livros = Livro.query.all()
    
    return livros