const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Conexão com o MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/bc', { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('connected', () => {
  console.log('MongoDB conectado');
});

// Definição do schema do usuário
const usersSchema = new mongoose.Schema({
  author_name: String,
  author_email: String,
  author_user: String,
  author_pwd: String,
  author_level: String,
  author_status: Boolean,
  author_create_date: { type: Date, default: Date.now }
});

const User = mongoose.model('User', usersSchema);

// Retornar todos os usuários
// GET "/users"
router.get('/', async (req, res) => {
  try {
    const foundedUser = await User.find();
    console.log('Objetos encontrados com sucesso!');
    res.status(200).json(foundedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Retornar um usuário específico por ID
// GET "/users/:pid"
router.get('/:pid', async (req, res) => {
  const pid = req.params.pid;

  // Verifica se o parâmetro pid está vazio
  if (!pid || pid.trim() === "") {
    return res.status(400).json({ message: 'O ID do usuário deve ser preenchido!' });
  }

  // Verifica se o parâmetro pid é um ID válido
  if (!mongoose.Types.ObjectId.isValid(pid)) {
    return res.status(400).json({ message: 'ID inválido!' });
  }

  try {
    const foundedUser = await User.findById(pid);
    if (!foundedUser) {
      return res.status(404).json({ message: 'Usuário não encontrado!' });
    }
    console.log('Objeto encontrado com sucesso!');
    res.json({ message: 'Usuário encontrado com sucesso!', foundedUser });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Retornar um ou mais usuários por nome
// GET "/users/name/:author_name"
router.get('/name/:author_name', async (req, res) => {
  const { author_name } = req.params;
  try {
    const foundUsers = await User.find({ author_name: new RegExp(author_name, 'i') }); // 'i' para case-insensitive
    if (!foundUsers.length) {
      return res.status(404).json({ message: 'Nenhum usuário encontrado com esse nome!' });
    }
    console.log('Usuários encontrados com sucesso!');
    res.json({ message: 'Usuários encontrados com sucesso!', foundUsers });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Inserir um novo usuário
// POST "/users" BODY { ... }
router.post('/', async (req, res) => {
  const user = req.body.user;
  try {
    const newUser = await User.create(user);
    console.log('Objeto salvo com sucesso!');
    res.json({ message: 'Usuário salvo com sucesso!', newUser });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Alterar um usuário
// PUT "/users/:id" BODY { ... }
router.put('/:pid', async (req, res) => {
  const pid = req.params.pid;
  const newUser = req.body.user;
  try {
    const updatedUser = await User.findByIdAndUpdate(pid, 
      { 
        author_name: newUser.author_name, 
        author_email: newUser.author_email,
        author_pwd: newUser.author_pwd,
        author_level: newUser.author_level,
        author_status: newUser.author_status,
      }, { new: true });
    console.log('Objeto Atualizado:', updatedUser);
    res.json({ message: 'Usuário alterado com sucesso!', updatedUser });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Deletar um usuário
// DELETE "/users/:id"
router.delete('/:pid', async (req, res) => {
  const pid = req.params.pid;

  // Verifica se o parâmetro pid é um ID válido
  if (!mongoose.Types.ObjectId.isValid(pid)) {
    return res.status(400).json({ message: 'ID inválido!' });
  }

  try {
    const deletedUser = await User.findByIdAndDelete(pid);
    console.log('Objeto deletado:', deletedUser);
    res.json({ message: 'Usuário deletado com sucesso!', deletedUser });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Rota para pesquisar usuários por data de criação
// GET "/users/date?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD"
router.get('/date', async (req, res) => {
  const { startDate, endDate } = req.query;

  // Verifica se ambos os parâmetros de data foram passados
  if (!startDate || !endDate) {
    return res.status(400).json({ message: 'As datas de início e fim são obrigatórias.' });
  }

  try {
    // Adicionar log para verificar os parâmetros recebidos
    console.log("Datas recebidas:", { startDate, endDate });

    // Convertendo as datas para o formato de Date do MongoDB
    const start = new Date(`${startDate}T00:00:00.000Z`); // Início do dia em UTC
    const end = new Date(`${endDate}T23:59:59.999Z`);     // Final do dia em UTC

    // Verificar se as datas são válidas
    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({ message: 'Datas inválidas.' });
    }

    // Buscar os usuários que têm uma data de criação dentro do intervalo especificado
    const foundUsers = await User.find({
      author_create_date: { $gte: start, $lte: end }, // Buscar entre as datas
    });

    if (foundUsers.length === 0) {
      return res.status(404).json({ message: 'Nenhum usuário encontrado nesse intervalo de datas.' });
    }

    res.json({ message: 'Usuários encontrados por data com sucesso!', foundUsers });
  } catch (err) {
    console.error("Erro ao buscar usuários por data:", err);
    res.status(500).json({ message: 'Erro interno no servidor.', error: err.message });
  }
});

module.exports = router;
