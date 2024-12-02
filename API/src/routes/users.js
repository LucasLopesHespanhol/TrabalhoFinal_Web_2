const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Conexão com o MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/bc', { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('connected', () => {
  console.log('MongoDB users conectado');
});

// Definição do schema do usuário
const usersSchema = new mongoose.Schema({
  author_name: String,
  author_email: String,
  author_user: String,
  author_pwd: String,
  author_level: { type: String, required: true },
  author_status: { type: Boolean, required: true },
  author_create_date: { type: Date, default: Date.now },
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

// Pesquisa por data
router.get('/date', async (req, res) => {
  const { startDate, endDate } = req.query;

  // Verifica se ambos os parâmetros de data foram passados
  if (!startDate || !endDate) {
    return res.status(400).json({ message: 'As datas de início e fim são obrigatórias.' });
  }

  try {
    console.log("Datas recebidas:", { startDate, endDate });

    // Convertendo as datas para o formato de Date do MongoDB
    const start = new Date(`${startDate}T00:00:00.000Z`);
    const end = new Date(`${endDate}T23:59:59.999Z`);

    // Validando as datas
    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({ message: 'Datas inválidas.' });
    }

    // Buscar os usuários que têm uma data de criação dentro do intervalo especificado
    const foundUsers = await User.find({
      author_create_date: { $gte: start, $lte: end },
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

// A rota de busca por ID deve vir DEPOIS da rota por data
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
        author_user: newUser.author_user,
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
// POST "/users/login"
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ author_user: username });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    if (user.author_pwd !== password) {
      return res.status(401).json({ message: 'Senha incorreta.' });
    }
    if (user.author_status === false) { // Ou !user.author_status
      console.log('Usuário inativo:', user.author_user);
      return res.status(403).json({ message: 'Usuário inativo. Contate o administrador.' });
    }

    if (user.author_level !== 'admin') {
      console.log('Acesso negado para nível:', user.author_level);
      return res.status(403).json({ message: 'Acesso negado. Apenas administradores podem acessar.' });
    }
    console.log('Login realizado com sucesso:', user.author_user);
    res.status(200).json({
      message: 'Login realizado com sucesso!',
      user: { id: user._id, username: user.author_user, level: user.author_level }
    });
  } catch (error) {
    console.error('Erro ao tentar logar:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
});

module.exports = router;