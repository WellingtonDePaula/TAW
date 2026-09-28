from config import *
from models.livro import Livro
import services.livro as livros_service

@app.route('/livros', methods=['GET'])
def retornar_livros():

    # buscar os livros
    livros = livros_service.retornar_livros()
    
    return jsonify({
        "resultado":"ok",
        "detalhes":[livro.json() for livro in livros]
    })

@app.route('/livro', methods=['POST'])
@jwt_required()
def criar_livro():
    # ler os dados em json
    dados = request.json
    
    # se faltou algum dado obrigatório...
    campos_obrigatorios = ('titulo', 'autores', 'edicao', 'ano_publicacao')
    if not dados or any(
        campo not in dados or dados[campo] is None or dados[campo] == ''
        for campo in campos_obrigatorios
    ):
        # retorna erro
        return jsonify({"resultado":"erro", "detalhes":"Título, autores, edição e ano de publicação são obrigatórios"}), 400
    
    # chama o serviço de criação de livro
    livro = livros_service.criar_livro(dados)
    
    # retornar mensagem de sucesso :-)
    return jsonify({
        "resultado":"ok", 
        "detalhes":livro.json()
    }), 201

