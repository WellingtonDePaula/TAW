async function carregarPosts() {
  // busca posts do backend
  const response = await fetch('/posts');
  // converte resposta para JSON
  const posts = await response.json();

  // limpa lista atual
  const lista = document.getElementById('lista-posts');
  lista.innerHTML = '';

  // percorre cada post da lista de posts
  posts.forEach(post => {
    // cria um elemento de lista
    const li = document.createElement('li');
    // preenche o conteúdo 
    li.innerHTML = `<strong>${post.titulo}</strong> ${post.conteudo}`;
    // adiciona o elemento na lista HTML
    lista.appendChild(li);
  });
}

async function criarPost() {
  // pega os valores digitados
  const titulo = document.getElementById('titulo').value;
  const conteudo = document.getElementById('conteudo').value;

  // validação simples para não enviar post vazio
  if(!titulo || !conteudo) {
      alert("Por favor, preencha o título e o conteúdo.");
      return;
  }

  // prepara o conteúdo da requisição
  const dados = JSON.stringify({ titulo, conteudo });
  
  // Mantive o alert que você usou para debugar, mas você pode removê-lo depois
  alert(`enviando para o backend: ${dados}`);
    
  // envia para o backend
  const response = await fetch('/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: dados
  });

  console.log(response);

  // limpa campos
  document.getElementById('titulo').value = '';
  document.getElementById('conteudo').value = '';


  // recarrega a lista
  carregarPosts();
}

// carrega ao abrir
carregarPosts();