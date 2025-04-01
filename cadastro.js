document.getElementById("produtoForm").addEventListener("submit", async function(e) {
    e.preventDefault();
    
    // Coletando os dados do formulário
    const nome = document.getElementById("nome").value;
    const codigo = document.getElementById("codigo").value;
    const quantidade = parseInt(document.getElementById("quantidade").value);
    const categoria = document.getElementById("categoria").value;
    const preco = parseFloat(document.getElementById("preco").value.replace(",", "."));
    
    // Enviar os dados para o servidor
    const resposta = await fetch("http://localhost:3000/produtos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        nome,
        codigo,
        quantidade,
        categoria,
        preco
      })
    });
  
    if (resposta.ok) {
      alert("Produto cadastrado com sucesso!");
      document.getElementById("produtoForm").reset();  // Limpa o formulário
    } else {
      alert("Erro ao cadastrar produto.");
    }
  });
  