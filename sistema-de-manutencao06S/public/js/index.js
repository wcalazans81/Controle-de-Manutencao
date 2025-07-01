document.addEventListener('DOMContentLoaded', function () {
   // const linksProtegidos = document.querySelectorAll('.protected-link');
    const restriExcluir = document.querySelectorAll('.restriExcluir');

    // Protege links com senha
    /*linksProtegidos.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const senha = prompt('Digite a senha para acessar esta página:');
            if (senha === '12we4w5e') {
                window.location.href = this.href;
            } else {
                alert('Senha incorreta!');
                window.location.href = '/';
            }
        });
    });*/

    // Protege botões de exclusão com senha
    restriExcluir.forEach(linkExcluir => {
        linkExcluir.addEventListener('click', function (e) {
            e.preventDefault();
            const senhaExcluir = prompt('Digite a senha para Excluir!');
            if (senhaExcluir === 'geb9@') {
                window.location.href = this.href;
            } else {
                alert("Não é possível excluir.\nSenha incorreta!");
                window.location.href = '/';
            }
        });
    });
});


