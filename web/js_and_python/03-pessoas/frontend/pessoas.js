async function carregarPessoas() {
  // busca pessoas do backend
  const response = await fetch('http://localhost:5000/pessoas');
  // converte resposta para JSON
  const pessoas = await response.json();

  // limpa lista atual
  const lista = document.getElementById('lista-pessoas');
  lista.innerHTML = '';

  // percorre cada pessoa da lista de pessoas
  pessoas.forEach(pessoa => {
    // cria um elemento de lista
    const li = document.createElement('li');
    // preenche o conteúdo 
    li.innerHTML = `<strong>${pessoa.nome}</strong>: ${pessoa.email} - ${pessoa.telefone}`;
    // adiciona o elemento na lista HTML
    lista.appendChild(li);
  });
}

async function criarPessoa() {
  // pega os valores digitados
  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;
  const telefone = document.getElementById('telefone').value;

  // prepara o conteúdo da requisição
  // converte o objeto JavaScript para uma string JSON
  const dados = JSON.stringify({ nome, email, telefone });
  alert(`enviando para o backend: ${dados}`);
    
  // envia para o backend
  await fetch('http://localhost:5000/pessoas', {
    method: 'POST',
    headers: {
      // sinaliza que os dados estão sendo enviados em formato JSON
      'Content-Type': 'application/json'
    },
    body: dados
  });

  // limpa campos
  document.getElementById('nome').value = '';
  document.getElementById('email').value = '';
  document.getElementById('telefone').value = '';
  
  // carrega novamente as pessoas
  // para mostrar a pessoa recém criada
  carregarPessoas();
}

// carrega pessoas ao abrir
carregarPessoas();