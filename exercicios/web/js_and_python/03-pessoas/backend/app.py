from flask import Flask, request, jsonify
from flask_cors import CORS
from model import Pessoa

app = Flask(__name__)
CORS(app)

# "Banco de dados" em memória
pessoas = []

# rota padrão
@app.route('/')
def index():
    return "backend de Pessoa operante :-)"

# rota para listar pessoas
@app.route('/pessoas', methods=['GET'])
def listar_pessoas():
    # retornar uma lista de pessoas em formato JSON
    return jsonify([pessoa.to_dict() for pessoa in pessoas])

# rota para inserir pessoa
@app.route('/pessoas', methods=['POST'])
def inserir_pessoa():
    # obter os dados
    data = request.get_json()
    nome = data.get('nome')
    email = data.get('email')
    telefone = data.get('telefone')
    # se faltar alguma informação, retornar erro
    if not nome or not email or not telefone:
        return jsonify({'error': 'Nome, email e telefone são obrigatórios'}), 400
    # criar a pessoa e adicionar à lista
    pessoa = Pessoa(nome, email, telefone)
    pessoas.append(pessoa)
    # retornar a pessoa criada em formato JSON
    return jsonify(pessoa.to_dict()), 201

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')