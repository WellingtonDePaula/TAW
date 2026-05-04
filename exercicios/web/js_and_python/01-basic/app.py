from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

# "Banco de dados" em memória
posts = []

# rota padrão
@app.route('/')
def index():
    return render_template('index.html')

# rota para retornar todos os posts
@app.route('/posts', methods=['GET'])
def get_posts():
    return jsonify(posts)

# rota para adicionar um post
@app.route('/posts', methods=['POST'])
def create_post():
    # obter os dados
    data = request.json
    
    # criar um post
    new_post = {
        "id": len(posts) + 1,
        "titulo": data.get("titulo"),
        "conteudo": data.get("conteudo")
    }
    
    # adicionar o post na lista
    posts.append(new_post)
    
    # retorno de resposta "ok"
    return jsonify(new_post), 201

if __name__ == '__main__':
    # app.run(debug=True)
    app.run(debug=True, host='0.0.0.0')