# Instruções de Commit - Tópicos Avançados em Web (JS / React / Next.js)

Você está gerando mensagens de commit para um repositório acadêmico. 
Analise as alterações nos arquivos JavaScript/JSX/TSX e classifique-as conforme as regras abaixo:

## 1. Identificação do Escopo
- Se a alteração for na pasta de exercícios: use `(exercicio)`
- Se a alteração for na pasta de trabalhos: use `(trabalho)`

## 2. Mapeamento Técnico (Convenções Front-end)
Escolha o tipo de commit baseado no impacto no código:
- **Novos Componentes ou Páginas Next.js:** Use `feat` (ex: criar página de login).
- **Gerenciamento de Estado / Hooks (useState, useEffect):** Use `feat` ou `refactor`.
- **Estilização (CSS Modules, Tailwind, etc):** Use `style` ou `feat`.
- **Consumo de API / Fetch / Axios:** Use `feat` ou `fix`.
- **Roteamento Dinâmico (App/Pages Router do Next):** Use `feat`.

## 3. Diretrizes de Escrita
- Escreva obrigatoriamente em **Português (Brasil)**.
- Comece o título com um verbo no infinitivo (ex: Criar, Ajustar, Implementar, Corrigir).
- Mencione termos chaves da stack (ex: Componente, Hook, Rota, State) quando relevante.

## 4. Estrutura da Mensagem
[tipo][(escopo)]: [Título curto - máx 50 caracteres]

[Descrição detalhada explicitando o conceito avançado aplicado. Ex: Uso de Server Components vs Client Components, hooks customizados, otimização de renderização, etc.]
