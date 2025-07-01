document.addEventListener('DOMContentLoaded', () => {
    preencherAno();

    document.getElementById('filtroForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const mes = document.getElementById('mes').value;
        const ano = document.getElementById('ano').value;

         // 👇 Aqui entra a validação:
         const queryParams = {};
         if (mes) queryParams.mes = mes;
         if (ano) queryParams.ano = ano;
 
         if (Object.keys(queryParams).length === 0) {
             alert('Preencha pelo menos um filtro');
             return;
         }

        const query = new URLSearchParams({ mes, ano }).toString();

        const res = await fetch(`/relatchecklist/dados?${query}`);
        const data = await res.json();
        renderTabela(data);
    });
});

function preencherAno() {
    const anoSelect = document.getElementById('ano');
    const anoAtual = new Date().getFullYear();

    for (let i = 2025; i <= anoAtual; i++) {
        const opt = document.createElement('option');
        opt.value = i;
        opt.text = i;
        anoSelect.appendChild(opt);
    }
}

function renderTabela(dados) {
    let container = document.getElementById('tabelaResultado');

    if (!container) {
        container = document.createElement('div');
        container.id = 'tabelaResultado';
        document.querySelector('main').appendChild(container);
    }

    container.innerHTML = '';

    const dadosValidos = Array.isArray(dados)
        ? dados.filter(item => item && typeof item === 'object' && item.data)
        : [];

    if (dadosValidos.length === 0) {
        container.innerHTML = '<p class="text-center mt-4">Nenhum resultado encontrado.</p>';
        return;
    }

    // Detecta se a tela é pequena
    const isMobile = window.innerWidth < 768;

    dadosValidos.forEach(item => {
        if (isMobile) {
            // ✅ Cria um card se for celular
            const card = document.createElement('div');
            card.classList.add('card', 'mb-3', 'shadow-sm');

            card.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title"><strong>Data:</strong> ${formatarData(item.data)}</h5>
                    <p><strong>Elétrica:</strong> ${item.eletrica}</p>
                    <p><strong>Hidráulica:</strong> ${item.hidraulica}</p>
                    <p><strong>Esgoto:</strong> ${item.esgoto}</p>
                    <p><strong>Pintura:</strong> ${item.pintura}</p>
                    <p><strong>Eletrodoméstico:</strong> ${item.eletrodomestico}</p>
                    <p><strong>Eletroeletrônico:</strong> ${item.eletroeletronico}</p>
                    <p><strong>Móveis:</strong> ${item.moveis}</p>
                    <p><strong>Porta:</strong> ${item.porta}</p>
                    <p><strong>Janela:</strong> ${item.janela}</p>
                    <p><strong>Ar Condicionado:</strong> ${item.arcondicionado}</p>
                    <p><strong>Outros:</strong> ${item.outros}</p>
                </div>
            `;
            container.appendChild(card);
        } else {
            // ✅ Cria uma tabela se for desktop
            const table = document.createElement('table');
            table.classList.add('table', 'table-bordered', 'mb-4');

            table.innerHTML = `
                <tbody>
                    <tr><td><strong>Data</strong></td><td>${formatarData(item.data)}</td></tr>
                    <tr><td><strong>Elétrica</strong></td><td>${item.eletrica}</td></tr>
                    <tr><td><strong>Hidráulica</strong></td><td>${item.hidraulica}</td></tr>
                    <tr><td><strong>Esgoto</strong></td><td>${item.esgoto}</td></tr>
                    <tr><td><strong>Pintura</strong></td><td>${item.pintura}</td></tr>
                    <tr><td><strong>Eletrodoméstico</strong></td><td>${item.eletrodomestico}</td></tr>
                    <tr><td><strong>Eletroeletrônico</strong></td><td>${item.eletroeletronico}</td></tr>
                    <tr><td><strong>Móveis</strong></td><td>${item.moveis}</td></tr>
                    <tr><td><strong>Porta</strong></td><td>${item.porta}</td></tr>
                    <tr><td><strong>Janela</strong></td><td>${item.janela}</td></tr>
                    <tr><td><strong>Ar Condicionado</strong></td><td>${item.arcondicionado}</td></tr>
                    <tr><td><strong>Outros</strong></td><td>${item.outros}</td></tr>
                </tbody>
            `;
            container.appendChild(table);
        }
    });
}





function formatarData(dataString) {
    const data = new Date(dataString);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
}


function limparFiltro() {
    // Limpar selects
    document.getElementById('mes').value = '';
    document.getElementById('ano').value = '';

    // Remover a tabela de resultados
    const resultado = document.getElementById('tabelaResultado');
    if (resultado) resultado.remove();

    // Esconder a mensagem "Nenhum resultado encontrado"
    const mensagemNenhumDado = document.querySelector('.text-center.mt-4');
    if (mensagemNenhumDado) mensagemNenhumDado.style.display = 'none';
}


async function salvarPDF_01() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Ocultar elementos visuais temporariamente
    const header = document.querySelector('header');
    const form = document.getElementById('filtroForm');
    const botoes = document.querySelectorAll('button, a.btn');
    const mensagemNenhumDado = document.querySelector('.text-center.mt-4');

    if (header) header.style.display = 'none';
    if (form) form.style.display = 'none';
    botoes.forEach(btn => btn.style.display = 'none');
    if (mensagemNenhumDado) mensagemNenhumDado.style.display = 'none';

    try {
        // Título
        const titulo = document.getElementById("t1");
        if (titulo) {
            doc.setFontSize(18);
            doc.text(titulo.innerText, 10, 10);
        }

        // Subtítulo
        const subtitulo = document.getElementById("t2");
        if (subtitulo) {
            doc.setFontSize(14);
            doc.text(subtitulo.innerText, 10, 20);
        }

        // Geração da tabela
        if (typeof doc.autoTable === 'function') {
            const table = document.querySelector("table");

            if (table) {
                doc.autoTable({
                    html: table,
                    startY: 30,
                    theme: 'grid',
                    headStyles: { fillColor: [220, 220, 220] },
                    styles: { fontSize: 10 }
                });
            } else {
                alert("Tabela não encontrada!");
            }

            const pdfBlob = doc.output("blob");
            const pdfUrl = URL.createObjectURL(pdfBlob);
            window.open(pdfUrl);
        } else {
            alert("autoTable não está carregado corretamente.");
        }
    } finally {
        // Restaurar os elementos ocultos
        if (header) header.style.display = '';
        if (form) form.style.display = '';
        botoes.forEach(btn => btn.style.display = '');
        if (mensagemNenhumDado) mensagemNenhumDado.style.display = '';
    }
}


