document.addEventListener('DOMContentLoaded', () => {
    console.log("relatorio.js carregado!");
    console.log("Script carregado com sucesso!");

    const buscarBtn = document.getElementById('buscar');
    const limparBtn = document.getElementById('limpar');
    const form = document.getElementById('filtro-relatorio');

    if (buscarBtn) {
        buscarBtn.addEventListener('click', (e) => {
            e.preventDefault();

            const empresa = form.empresa.value;
            const dataInicio = document.getElementById('dataInicio').value;
            const dataFim = document.getElementById('dataFim').value;

            let query = `/relatorio?empresa=${empresa}`;
            if (dataInicio) query += `&dataInicio=${dataInicio}`;
            if (dataFim) query += `&dataFim=${dataFim}`;

            window.location.href = query;
        });
    }

    if (limparBtn) {
        limparBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log("Clique no botão limpar!");
            form.reset();
            window.location.href = '/relatorio';
            window.location.replace('/relatorio'); // substitui a URL e força reload

        });
    }
});

async function salvarPDF_00() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

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

    // Espera o plugin autoTable estar disponível
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
}
