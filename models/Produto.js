const mongoose = require('mongoose');

const produtoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  codigo: { type: String, required: true },
  quantidade: { type: Number, required: true },
  categoria: { type: String, required: true },
  preco: { type: Number, required: true },
});

const Produto = mongoose.model('produto', produtoSchema);

module.exports = Produto;
