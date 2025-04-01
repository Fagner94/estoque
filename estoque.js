document.addEventListener("DOMContentLoaded", async () => {
    const listaProdutos = document.getElementById("listaProdutos");

    async function carregarProdutos() {
        try {
            const response = await fetch("http://localhost:3000/produtos");
            const categorias = await response.json();
            console.log(categorias);

            listaProdutos.innerHTML = ""; // Limpa a lista

            categorias.forEach(categoria => {
                const categoriaDiv = document.createElement("div");
                categoriaDiv.classList.add("categoria-container");

                const categoriaTitulo = document.createElement("h2");
                categoriaTitulo.textContent = categoria._id;

                const btnExcluirCategoria = document.createElement("button");
                btnExcluirCategoria.textContent = "Excluir Categoria";
                btnExcluirCategoria.classList.add("btn-excluir");
                btnExcluirCategoria.addEventListener("click", () => excluirCategoria(categoria._id));

                categoriaDiv.appendChild(categoriaTitulo);
                categoriaDiv.appendChild(btnExcluirCategoria);
                listaProdutos.appendChild(categoriaDiv);

                const ul = document.createElement("ul");
                categoria.produtos.forEach(produto => {
                    const li = document.createElement("li");
                    li.textContent = `Nome: ${produto.nome} | Código: ${produto.codigo} | Quantidade: `;
                    
                    const quantidadeSpan = document.createElement("span");
                    quantidadeSpan.id = `quantidade-${produto._id}`;
                    quantidadeSpan.textContent = produto.quantidade;

                    li.appendChild(quantidadeSpan);

                    // Criar botões para alterar a quantidade
                    const btnDiminuir = document.createElement("button");
                    btnDiminuir.textContent = "-";
                    btnDiminuir.classList.add("btn-alterar");
                    btnDiminuir.addEventListener("click", () => alterarQuantidade(produto._id, -1));

                    const btnAumentar = document.createElement("button");
                    btnAumentar.textContent = "+";
                    btnAumentar.classList.add("btn-alterar");
                    btnAumentar.addEventListener("click", () => alterarQuantidade(produto._id, 1));

                    // Criar botão de exclusão do produto
                    const btnExcluir = document.createElement("button");
                    btnExcluir.textContent = "Excluir";
                    btnExcluir.classList.add("btn-excluir");
                    btnExcluir.addEventListener("click", () => excluirProduto(produto._id));

                    li.appendChild(btnDiminuir);
                    li.appendChild(btnAumentar);
                    li.appendChild(btnExcluir);
                    ul.appendChild(li);
                });

                listaProdutos.appendChild(ul);
            });
        } catch (error) {
            console.error("Erro ao carregar produtos:", error);
            listaProdutos.innerHTML = "<li>Erro ao carregar os produtos.</li>";
        }
    }

    async function excluirProduto(id) {
        try {
            const response = await fetch(`http://localhost:3000/produtos/${id}`, { method: "DELETE" });
            if (response.ok) {
                alert("Produto excluído com sucesso!");
                carregarProdutos();
            } else {
                alert("Erro ao excluir produto.");
            }
        } catch (error) {
            console.error("Erro ao excluir produto:", error);
            alert("Erro ao excluir produto.");
        }
    }

    async function excluirCategoria(categoria) {
        try {
            const response = await fetch(`http://localhost:3000/produtos/categoria/${categoria}`, { method: "DELETE" });
            if (response.ok) {
                alert("Categoria excluída com sucesso!");
                carregarProdutos();
            } else {
                alert("Erro ao excluir categoria.");
            }
        } catch (error) {
            console.error("Erro ao excluir categoria:", error);
            alert("Erro ao excluir categoria.");
        }
    }

    // Função para alterar a quantidade
    async function alterarQuantidade(id, valor) {
        try {
            const response = await fetch(`http://localhost:3000/produtos/alterar/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quantidade: valor })
            });

            if (response.ok) {
                const quantidadeAtualizada = document.getElementById(`quantidade-${id}`);
                quantidadeAtualizada.textContent = parseInt(quantidadeAtualizada.textContent) + valor;
            } else {
                alert("Erro ao atualizar quantidade");
            }
        } catch (error) {
            console.error("Erro ao alterar quantidade:", error);
            alert("Erro ao alterar quantidade.");
        }
    }

    carregarProdutos();
});
