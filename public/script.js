document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("produtoForm");
    const mensagem = document.getElementById("mensagem");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const nome = document.getElementById("nome").value;
        const codigo = document.getElementById("codigo").value;
        const quantidade = document.getElementById("quantidade").value;
        const categoria = document.getElementById("categoria").value;
        const preco = document.getElementById("preco").value;

        const produto = { nome, codigo, quantidade, categoria, preco };

        try {
            const response = await fetch("http://localhost:3000/produtos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(produto)
            });

            if (response.ok) {
                exibirMensagem("Produto cadastrado com sucesso!", "sucesso");
                form.reset(); // Limpa o formulário após cadastro
            } else {
                exibirMensagem("Erro ao cadastrar produto!", "erro");
            }
        } catch (error) {
            exibirMensagem("Erro ao conectar ao servidor!", "erro");
        }
    });

    function exibirMensagem(texto, tipo) {
        mensagem.textContent = texto;
        mensagem.className = tipo;
        mensagem.style.opacity = 1;
        setTimeout(() => {
            mensagem.style.opacity = 0;
        }, 4000);
    }
});
