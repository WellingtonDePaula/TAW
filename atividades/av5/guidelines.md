# Guidelines do Sistema de Jogos

Este documento define as convenções para implementar o cadastro e a consulta de jogos neste projeto. O backend usa Python com Flask e SQLAlchemy; o frontend usa React, Next.js e TypeScript.

## Modelo de jogo

Use `Jogo` como entidade principal e mantenha os mesmos nomes de campo no banco, na API e no frontend:

| Campo | Tipo recomendado | Regras |
| --- | --- | --- |
| `id` | inteiro ou UUID | Gerado pelo sistema e usado como identificador. |
| `nome` | texto | Obrigatório; remover espaços nas extremidades e rejeitar valor vazio. |
| `descricao` | texto | Obrigatória; aceitar texto longo e preservar parágrafos. |
| `banner` | URL ou caminho de imagem | Obrigatório; validar formato e apresentar imagem alternativa quando indisponível. |
| `preco_base` | decimal | Obrigatório e maior que zero. Nunca usar ponto flutuante para cálculos monetários. |
| `preco_ofertado` | decimal ou nulo | Opcional; quando informado, deve ser maior que zero e menor que `preco_base`. Nulo significa sem oferta. |
| `generos` | relação de gêneros | Um jogo pode ter um ou mais gêneros. Evitar armazenar a lista como texto separado por vírgulas. |
| `distribuidora` | texto | Obrigatória; remover espaços nas extremidades e rejeitar valor vazio. |
| `desenvolvedora` | texto | Obrigatória; este é o nome correto do campo (não `desdenvolvedora`). |

Use `NUMERIC`/`DECIMAL` no banco e `Decimal` no Python para preços. A API deve serializar preços como números decimais consistentes ou strings decimais, sem introduzir erros de arredondamento. A interface deve formatá-los como moeda em pt-BR, sem alterar o valor persistido.

Gêneros devem ser entidades reutilizáveis relacionadas a jogos por uma associação muitos-para-muitos. Evite duplicar gêneros com diferenças apenas de caixa ou espaços. Defina limites de tamanho razoáveis para textos e valide também no servidor.

## Backend

- Mantenha o código organizado conforme a estrutura existente: modelos em `src/models`, rotas em `src/routes` e regras de negócio em `src/services`.
- Use SQLAlchemy para persistência e migrações versionadas para alterações no esquema. Não crie ou altere tabelas manualmente em produção.
- Centralize a validação dos dados recebidos no backend; validações do frontend servem para orientar, mas não substituem as do servidor.
- Disponibilize operações de listagem, consulta por identificador, criação, atualização e exclusão de jogos. Siga o padrão de rotas e respostas já existente no projeto.
- Receba e retorne JSON com os campos do modelo. Para `generos`, use uma lista de identificadores ou objetos com `id` e `nome`; escolha um formato e mantenha-o uniforme.
- Retorne códigos HTTP adequados: `201` ao criar, `200` em consultas/alterações bem-sucedidas, `204` ao excluir, `400` para dados inválidos, `404` para jogo inexistente e `401`/`403` conforme a autenticação e autorização existentes.
- Responda erros em formato previsível, sem expor stack traces, credenciais ou detalhes internos do banco.
- Aplique autenticação e autorização às operações de escrita conforme o mecanismo já usado pelo projeto. Não confie em identificadores ou permissões enviados pelo cliente.
- Se `banner` for enviado como arquivo em vez de URL, valide tipo e tamanho, gere um nome de armazenamento seguro e não grave o conteúdo binário diretamente no banco. Documente essa decisão antes de mudar o contrato da API.

## Frontend

- Use TypeScript e a estrutura App Router existente em `front-end/app`. Consulte as instruções locais e a documentação da versão instalada do Next.js antes de usar ou alterar APIs do framework.
- Crie interfaces e tipos para jogo e gênero alinhados ao contrato da API; não use `any` para contornar incompatibilidades.
- A tela de cadastro/edição deve conter todos os campos do modelo, permitir selecionar um ou mais gêneros e mostrar claramente preço base e preço ofertado.
- Exiba validações junto aos campos: obrigatoriedade, preços positivos e oferta menor que o preço base. Preserve os dados preenchidos quando a API retornar erro.
- Mostre estados de carregamento, sucesso, erro e lista vazia. Evite envios duplicados enquanto a gravação estiver em andamento.
- Apresente o preço ofertado como preço atual somente quando estiver preenchido; caso contrário, use o preço base. Formate os valores com `Intl.NumberFormat` para `pt-BR` e `BRL`.
- Para banners, use texto alternativo útil, dimensões estáveis e um estado de fallback quando a imagem não carregar. Não renderize uma URL arbitrária sem as proteções e configurações de imagem recomendadas pelo Next.js.
- Mantenha componentes acessíveis: rótulos associados aos campos, navegação por teclado, foco visível e mensagens de erro compreensíveis.
- Centralize a comunicação HTTP com o backend. Configure a URL base por variável de ambiente pública apropriada (`NEXT_PUBLIC_...`) e nunca exponha segredos no bundle do navegador.
- Mantenha o visual e os padrões de componentes já adotados pelo projeto; não introduza uma biblioteca de UI sem necessidade.

## Verificação

- Teste no backend criação válida, campos obrigatórios, preços inválidos, gêneros inexistentes, identificador inexistente e operações sem autorização.
- Teste no frontend envio válido, mensagens de validação, falha da API, carregamento e apresentação com/sem oferta e banner.
- Execute as verificações disponíveis nos projetos: `uv run pytest` (se houver testes configurados) e `npm run lint` / `npm run build` no frontend.
- Mantenha exemplos e documentação da API atualizados sempre que o contrato dos campos mudar.
