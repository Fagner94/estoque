const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 3000;

// Importar modelo de produto
const Produto = require('./models/Produto');

// Conectar ao MongoDB Atlas
mongoose.connect('mongodb+srv://fagner:160294vasco@cluster0.rx756z0.mongodb.net/estoque')
  .then(() => console.log('Conectado ao MongoDB Atlas'))
  .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

app.use(cors());
app.use(express.json());

// Rota de teste
app.get('/', (req, res) => {
  res.send('Servidor rodando');
});

// Rota para criar produto
app.post('/produtos', async (req, res) => {
  const { nome, codigo, quantidade, categoria, preco } = req.body;

  if (!nome || !codigo || !quantidade || !categoria || !preco) {
    return res.status(400).send('Todos os campos são obrigatórios');
  }

  const novoProduto = new Produto({
    nome,
    codigo,
    quantidade,
    categoria,
    preco
  });

  try {
    await novoProduto.save();
    res.status(201).send('Produto cadastrado com sucesso');
  } catch (error) {
    console.error('Erro ao cadastrar produto:', error);
    res.status(500).send('Erro ao cadastrar produto');
  }
});

// Rota para listar produtos agrupados por categoria
app.get('/produtos', async (req, res) => {
  try {
    const produtos = await Produto.aggregate([
      { $group: { _id: "$categoria", produtos: { $push: "$$ROOT" } } },
      { $sort: { _id: 1 } }  // Ordenar por categoria
    ]);
    res.json(produtos);
  } catch (error) {
    console.error('Erro ao listar produtos:', error);
    res.status(500).send('Erro ao listar produtos');
  }
});

// Rota para excluir um produto pelo ID
app.delete('/produtos/:id', async (req, res) => {
  try {
      await Produto.findByIdAndDelete(req.params.id);
      res.status(200).send("Produto excluído com sucesso.");
  } catch (error) {
      console.error("Erro ao excluir produto:", error);
      res.status(500).send("Erro ao excluir produto.");
  }
});

// Rota para excluir todos os produtos de uma categoria
app.delete('/produtos/categoria/:categoria', async (req, res) => {
  try {
      await Produto.deleteMany({ categoria: req.params.categoria });
      res.status(200).send("Todos os produtos da categoria foram excluídos.");
  } catch (error) {
      console.error("Erro ao excluir categoria:", error);
      res.status(500).send("Erro ao excluir categoria.");
  }
});

// Rota para aumentar a quantidade do produto
app.patch('/produtos/aumentar/:id', async (req, res) => {
  try {
    const produto = await Produto.findByIdAndUpdate(
      req.params.id,
      { $inc: { quantidade: 1 } }, // Aumenta 1 unidade
      { new: true }
    );
    res.json(produto);
  } catch (error) {
    console.error('Erro ao aumentar quantidade:', error);
    res.status(500).send('Erro ao aumentar quantidade.');
  }
});

// Rota para diminuir a quantidade do produto
app.patch('/produtos/diminuir/:id', async (req, res) => {
  try {
    const produto = await Produto.findById(req.params.id);
    if (!produto) return res.status(404).send('Produto não encontrado.');

    if (produto.quantidade > 0) {
      produto.quantidade -= 1;
      await produto.save();
      res.json(produto);
    } else {
      res.status(400).send('A quantidade já é zero.');
    }
  } catch (error) {
    console.error('Erro ao diminuir quantidade:', error);
    res.status(500).send('Erro ao diminuir quantidade.');
  }
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
