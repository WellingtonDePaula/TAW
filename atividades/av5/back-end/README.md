# API de pessoas e jogos

Backend Flask para cadastro de pessoas e jogos. Usa SQLAlchemy, PostgreSQL em produção ou SQLite local, e JWT para proteger operações de escrita.

## Configuração e execução

No diretório `back-end`, instale as dependências e configure as variáveis de ambiente:

```powershell
uv sync
$env:JWT_SECRET_KEY = "defina-uma-chave-secreta-longa"
uv run flask --app src.app db upgrade
uv run flask --app src.app run
```

Sem `DATABASE_URL` ou `POSTGRES_URL_NON_POOLING`, o banco SQLite é criado em `src/database/jogos.db`. Em produção, configure `DATABASE_URL`, `JWT_SECRET_KEY` e `CORS_ORIGINS`; não use o servidor de desenvolvimento do Flask em produção. A chave JWT deve permanecer estável entre reinicializações. `CORS_ORIGINS` aceita origens separadas por vírgula.

## Dados de teste

Depois de aplicar as migrações, carregue os dados de demonstração com:

```powershell
uv run flask --app src.app seed-dados-teste
```

O comando pode ser executado novamente sem duplicar gêneros ou jogos. Ele cadastra três jogos e os gêneros relacionados, além de criar ou redefinir a conta local de teste:

| Campo | Valor |
| --- | --- |
| Nome | `Usuario de Teste` |
| Login | `teste` |
| Senha | `teste1234` |

Use essa conta apenas em desenvolvimento/testes. Não execute a carga de teste em produção; a senha é conhecida e o comando redefine a senha dessa conta sempre que executado.

## Testar rotas no Bash

Os exemplos abaixo precisam de `curl` e `jq`. Inicie a API e carregue os dados de teste antes de executá-los. Use uma conta de desenvolvimento; não envie credenciais de teste a um servidor de produção.

Defina a URL da API e obtenha um token com a conta criada pelo seed:

```bash
BASE_URL="http://127.0.0.1:5000"
TOKEN=$(curl -fsS -X POST "$BASE_URL/login" \
  -H "Content-Type: application/json" \
  -d '{"login":"teste","senha":"teste1234"}' | jq -r '.dados.token')
```

Verifique a API e faça consultas públicas/autenticadas:

```bash
curl -i "$BASE_URL/"
curl -i "$BASE_URL/generos"
curl -i "$BASE_URL/jogos"
curl -i "$BASE_URL/pessoas" -H "Authorization: Bearer $TOKEN"
```

Cadastre uma pessoa (o sufixo evita conflito ao repetir o exemplo) e um gênero:

```bash
SUFIXO=$(date +%s)
curl -i -X POST "$BASE_URL/pessoas" \
  -H "Content-Type: application/json" \
  -d "{\"nome\":\"Pessoa Bash\",\"email\":\"bash-${SUFIXO}@example.com\",\"login\":\"bash-${SUFIXO}\",\"senha\":\"senha1234\"}"

GENERO_ID=$(curl -fsS -X POST "$BASE_URL/generos" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"nome\":\"Teste-${SUFIXO}\"}" | jq -r '.dados.id')
curl -i "$BASE_URL/generos"
```

Crie um jogo, consulte, atualize por `PUT` ou `PATCH` e exclua-o:

```bash
JOGO_ID=$(curl -fsS -X POST "$BASE_URL/jogos" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"nome\":\"Jogo Bash ${SUFIXO}\",\"descricao\":\"Cadastro de teste pela API.\",\"banner\":\"https://placehold.co/1200x500?text=Jogo+Bash\",\"preco_base\":\"59.90\",\"preco_ofertado\":\"39.90\",\"generos\":[${GENERO_ID}],\"distribuidora\":\"Distribuidora de Teste\",\"desenvolvedora\":\"Estudio de Teste\"}" | jq -r '.dados.id')

curl -i "$BASE_URL/jogos/$JOGO_ID"
curl -i -X PUT "$BASE_URL/jogos/$JOGO_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"nome\":\"Jogo Bash ${SUFIXO}\",\"descricao\":\"Cadastro substituido via PUT.\",\"banner\":\"https://placehold.co/1200x500?text=Jogo+Bash\",\"preco_base\":\"59.90\",\"preco_ofertado\":\"39.90\",\"generos\":[${GENERO_ID}],\"distribuidora\":\"Distribuidora de Teste\",\"desenvolvedora\":\"Estudio de Teste\"}"
curl -i -X PATCH "$BASE_URL/jogos/$JOGO_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"preco_ofertado":"29.90"}'
curl -i -X DELETE "$BASE_URL/jogos/$JOGO_ID" \
  -H "Authorization: Bearer $TOKEN"
```

Para testar erros de validação, envie uma oferta igual ao preço base; a API deve responder `400`:

```bash
curl -i -X POST "$BASE_URL/jogos" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"nome\":\"Jogo Invalido ${SUFIXO}\",\"descricao\":\"Teste de validacao.\",\"banner\":\"https://placehold.co/1200x500\",\"preco_base\":\"20.00\",\"preco_ofertado\":\"20.00\",\"generos\":[${GENERO_ID}],\"distribuidora\":\"Distribuidora\",\"desenvolvedora\":\"Estudio\"}"
```

## Contrato HTTP

Respostas de sucesso usam `dados`; erros usam `erro.mensagem` e, quando pertinente, `erro.campos`. Os preços são strings decimais com duas casas. `generos` é uma lista de objetos `{ "id", "nome" }` na resposta e uma lista de IDs na escrita.

| Método e rota | Acesso | Descrição |
| --- | --- | --- |
| `POST /pessoas` | Público | Cadastra pessoa com nome, e-mail, login, senha e telefone opcional. |
| `GET /pessoas` | JWT | Lista identificador, nome e login, sem expor dados de contato ou senha. |
| `POST /login` | Público | Autentica uma pessoa cadastrada e retorna um JWT. |
| `GET /jogos` | Público | Lista jogos. |
| `GET /jogos/<id>` | Público | Consulta um jogo. |
| `POST /jogos` | JWT | Cadastra um jogo. |
| `PUT /jogos/<id>` | JWT | Substitui os dados do jogo. |
| `PATCH /jogos/<id>` | JWT | Atualiza parcialmente o jogo. |
| `DELETE /jogos/<id>` | JWT | Exclui um jogo. |
| `GET /generos` | Público | Lista gêneros disponíveis. |
| `POST /generos` | JWT | Cadastra um gênero. |

Senhas devem ter ao menos 8 bytes e são armazenadas como hash bcrypt. E-mail e login são únicos; o login é normalizado para minúsculas. Nunca retorne o hash em respostas.

Exemplo de cadastro de pessoa:

```json
{
  "nome": "Pessoa Exemplo",
  "email": "pessoa@example.com",
  "login": "pessoa",
  "senha": "uma-senha-forte",
  "telefone": "(00) 00000-0000"
}
```

Exemplo de criação de gênero:

```json
{ "nome": "Aventura" }
```

Exemplo de jogo (use IDs existentes em `generos`):

```json
{
  "nome": "Jogo Exemplo",
  "descricao": "Descrição do jogo.",
  "banner": "https://example.com/banner.jpg",
  "preco_base": "99.90",
  "preco_ofertado": "79.90",
  "generos": [1],
  "distribuidora": "Distribuidora Exemplo",
  "desenvolvedora": "Estúdio Exemplo"
}
```

Cadastre uma conta em `/pessoas`, autentique em `/login` com `login` e `senha`, e envie `Authorization: Bearer <TOKEN>` nas operações protegidas. Execute os testes com `uv run python -m unittest discover -s tests`.