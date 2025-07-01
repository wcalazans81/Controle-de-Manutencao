document.addEventListener('DOMContentLoaded', function () {
  const btnMostrarBusca = document.getElementById('btnMostrarBusca');
  const campoBusca = document.getElementById('campoBusca');
  const btnBuscar = document.getElementById('btnBuscar');
  const inputBusca = document.getElementById('inputBusca');
  const datalist = document.getElementById('opcoesBusca');
  const btnAdicionar = document.getElementById('btnAdicionar');
  const btnSalvarPDF = document.getElementById('btnSalvarPDF');
  const tabelas = document.querySelectorAll('table tbody');

  // Mostrar/Esconder campo de busca
  btnMostrarBusca.addEventListener('click', () => {
    campoBusca.style.display = campoBusca.style.display === 'none' ? 'block' : 'none';
    inputBusca.focus();
  });

  // Preencher autocomplete com nome e descrição únicos (coluna 0 e 2)
  const opcoesSet = new Set();
  tabelas.forEach(tbody => {
    const linhas = tbody.querySelectorAll('tr');
    linhas.forEach(linha => {
      const nome = linha.children[0]?.textContent.trim();
      const descricao = linha.children[2]?.textContent.trim();
      if (nome) opcoesSet.add(nome);
      if (descricao) opcoesSet.add(descricao);
    });
  });

  opcoesSet.forEach(texto => {
    const option = document.createElement('option');
    option.value = texto;
    datalist.appendChild(option);
  });

  // Função de buscar itens (sem esconder, apenas destacando)
  function buscarItens() {
    const termo = inputBusca.value.toLowerCase().trim();
    let encontrou = false;
    let primeiroEncontrado = null;

      tabelas.forEach(tbody => {
    const linhas = tbody.querySelectorAll('tr');

    linhas.forEach(linha => {
      // Remove destaque anterior
      linha.classList.remove('destaque');

      const nome = linha.children[0]?.textContent.toLowerCase();
      const descricao = linha.children[2]?.textContent.toLowerCase();
      const corresponde = nome.includes(termo) || descricao.includes(termo);

      if (corresponde) {
        linha.classList.add('destaque'); // aplica a cor
        if (!primeiroEncontrado) {
          primeiroEncontrado = linha;
          encontrou = true;
        }
        } else {
          linha.classList.remove('destaque');
        }
      });
    });

    // Esconder o campo de busca e limpar o input
    campoBusca.style.display = 'none';
    inputBusca.value = '';

    if (encontrou && primeiroEncontrado) {
      primeiroEncontrado.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      alert('Nenhum item encontrado no estoque.');
    }
    if (encontrou) {
  const resultadoAnchor = document.getElementById('resultado-busca');
  if (resultadoAnchor) {
    resultadoAnchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
} else {
  alert('Nenhum item encontrado no estoque.');
}

  }

  btnBuscar.addEventListener('click', buscarItens);

  inputBusca.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      buscarItens();
    }
  });
});


  // Função de adicionar item
  btnAdicionar.addEventListener('click', () => {
    const categoria = document.getElementById('categoriaSelect').value;
    const nome = document.getElementById('nomeItem').value.trim();
    const quantidade = parseInt(document.getElementById('quantidadeItem').value, 10);
    const descricao = document.getElementById('descricaoItem').value.trim();

    if (!categoria || !nome || isNaN(quantidade) || !descricao) {
      alert('Preencha todos os campos para adicionar um item!');
      return;
    }

    // Enviar para servidor
    fetch('/estoque/adicionar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ categoria, nome, quantidade, descricao })
    })
    .then(response => {
      if (response.ok) {
        alert('Item adicionado com sucesso!');
        location.reload();
      } else {
        alert('Erro ao adicionar item.');
      }
    })
    .catch(error => {
      console.error('Erro ao adicionar item:', error);
      alert('Erro ao adicionar item.');
    });
  });

 // Evento de adicionar (+) quantidade
document.querySelectorAll('.btn-adicionar').forEach(botao => {
  botao.addEventListener('click', function () {
    const id = this.dataset.id;
    const tabela = this.dataset.tabela;

    fetch('/estoque/atualizar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id, tabela, operacao: 'incrementar' })
    })
    .then(response => response.ok ? location.reload() : alert('Erro ao atualizar quantidade.'))
    .catch(error => {
      console.error('Erro ao atualizar:', error);
      alert('Erro ao atualizar quantidade.');
    });
  });
});


 // Evento de remover (-) quantidade
document.querySelectorAll('.btn-remover').forEach(botao => {
  botao.addEventListener('click', function () {
    const id = this.dataset.id;
    const tabela = this.dataset.tabela; // Se estiver usando controle por tabela
    // const nome = this.dataset.nome; // Usado apenas se quiser exibir

    fetch('/estoque/atualizar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id, tabela, operacao: 'decrementar' }) // Inclui id e tabela se necessário
    })
    .then(response => {
      if (response.ok) {
        location.reload();
      } else {
        alert('Erro ao atualizar quantidade.');
      }
    })
    .catch(error => {
      console.error('Erro ao atualizar:', error);
      alert('Erro ao atualizar quantidade.');
    });
  });
});


  document.querySelectorAll('.btn-excluir').forEach(botao => {
    botao.addEventListener('click', function () {
      if (confirm('Tem certeza que deseja excluir este item?')) {
        const id = this.dataset.id;
        const tabela = this.dataset.tabela;
  
        fetch('/estoque/excluir', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id, tabela })
        })
        .then(response => response.ok ? location.reload() : alert('Erro ao excluir item.'))
        .catch(error => {
          console.error('Erro ao excluir:', error);
          alert('Erro ao excluir item.');
        });
      }
    });
  });
  // Salvar Estoque em PDF
  btnSalvarPDF.addEventListener('click', () => {
    window.print();
  });
