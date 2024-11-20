const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Conectar ao MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/bc', { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('connected', () => {
  console.log('MongoDB conectado');
});

// Schema e modelo para "teachers"
const teachersSchema = new mongoose.Schema({
  name: { type: String, required: true },
  school_disciplines: { type: String, required: true },
  contact: { type: String, required: true },
  phone_number: { type: String, required: true },
  status: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

const Teacher = mongoose.model('Teacher', teachersSchema);

// ** Rotas para os professores **

// Retornar todos os professores
// GET "/teachers"
router.get('/', async (req, res) => {
  try {
    const teachers = await Teacher.find();
    console.log('Professores encontrados com sucesso!');
    res.status(200).json(teachers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Retornar um professor específico pelo ID
// GET "/teachers/:id"
router.get('/:id', async (req, res) => {
  const id = req.params.id;

  // Verifica se o ID é válido
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID inválido!' });
  }

  try {
    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return res.status(404).json({ message: 'Professor não encontrado!' });
    }
    console.log('Professor encontrado com sucesso!');
    res.status(200).json(teacher);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Inserir um novo professor
// POST "/teachers"
router.post('/', async (req, res) => {
  const { name, school_disciplines, contact, phone_number, status } = req.body;
  if (!name || !school_disciplines || !contact || !phone_number || !status) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios!' });
  }

  try {
    const newTeacher = new Teacher({ name, school_disciplines, contact, phone_number, status });
    await newTeacher.save();
    console.log('Professor adicionado com sucesso!');
    res.status(201).json({ message: 'Professor adicionado com sucesso!', newTeacher });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Atualizar dados de um professor
// PUT "/teachers/:id"
router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const { name, school_disciplines, contact, phone_number, status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID inválido!' });
  }

  try {
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      id,
      { name, school_disciplines, contact, phone_number, status },
      { new: true, runValidators: true }
    );
    if (!updatedTeacher) {
      return res.status(404).json({ message: 'Professor não encontrado!' });
    }
    console.log('Professor atualizado com sucesso!');
    res.status(200).json({ message: 'Professor atualizado com sucesso!', updatedTeacher });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Deletar um professor
// DELETE "/teachers/:id"
router.delete('/:id', async (req, res) => {
  const id = req.params.id;

  // Verifica se o ID é válido
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID inválido!' });
  }

  try {
    const deletedTeacher = await Teacher.findByIdAndDelete(id);
    if (!deletedTeacher) {
      return res.status(404).json({ message: 'Professor não encontrado!' });
    }
    console.log('Professor deletado com sucesso!');
    res.status(200).json({ message: 'Professor deletado com sucesso!', deletedTeacher });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Rota para pesquisar professores por data de criação
// GET "/teachers/date?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD"
router.get('/date', async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({ message: 'As datas de início e fim são obrigatórias.' });
  }

  try {
    const start = new Date(`${startDate}T00:00:00.000Z`);
    const end = new Date(`${endDate}T23:59:59.999Z`);

    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({ message: 'Datas inválidas.' });
    }

    const foundTeachers = await Teacher.find({
      created_at: { $gte: start, $lte: end }
    });

    if (foundTeachers.length === 0) {
      return res.status(404).json({ message: 'Nenhum professor encontrado nesse intervalo de datas.' });
    }

    res.status(200).json({ message: 'Professores encontrados por data com sucesso!', foundTeachers });
  } catch (err) {
    console.error("Erro ao buscar professores por data:", err);
    res.status(500).json({ message: 'Erro interno no servidor.', error: err.message });
  }
});

module.exports = router;
