const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Conectar ao MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/bc', { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('connected', () => console.log('MongoDB teachers conectado!'));
mongoose.connection.on('error', (err) => console.error('Erro ao conectar ao MongoDB:', err));

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

// ** Rotas **

// Retornar todos os professores
router.get('/', async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.status(200).json(teachers);
  } catch (err) {
    console.error('Erro ao buscar professores:', err.message);
    res.status(500).json({ message: 'Erro ao buscar professores.', error: err.message });
  }
});

// Buscar por intervalo de datas
router.get('/date', async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({ message: 'As datas de início e fim são obrigatórias.' });
  }

  try {
    // Convertendo as strings para objetos de data
    const start = new Date(`${startDate}T00:00:00.000Z`); // Data inicial em UTC
    const end = new Date(`${endDate}T23:59:59.999Z`); // Data final em UTC

    console.log(start)
    console.log(end)

    // Validar se as datas são válidas
    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({ message: 'Datas inválidas.' });
    }

    // Buscar professores dentro do intervalo de datas
    const foundTeachers = await Teacher.find({
      created_at: { $gte: start, $lte: end },
    });

    if (foundTeachers.length === 0) {
      return res.status(404).json({ message: 'Nenhum professor encontrado nesse intervalo de datas.' });
    }

    res.status(200).json({ message: 'Professores encontrados com sucesso!', foundTeachers });
  } catch (err) {
    console.error('Erro ao buscar professores por intervalo de datas:', err.message);
    res.status(500).json({ message: 'Erro interno no servidor.', error: err.message });
  }
});

// Buscar por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID inválido.' });
  }

  try {
    const teacher = await Teacher.findById(id);

    if (!teacher) {
      return res.status(404).json({ message: 'Professor não encontrado.' });
    }

    res.status(200).json(teacher);
  } catch (err) {
    console.error('Erro ao buscar professor por ID:', err.message);
    res.status(500).json({ message: 'Erro interno no servidor.', error: err.message });
  }
});

// Retornar um ou mais professores por nome
// GET "/teachers/name/:name"
router.get('/name/:name', async (req, res) => {
  const { name } = req.params;

  try {
    // Alterado de User.find() para Teacher.find()
    const foundTeachers = await Teacher.find({ name: new RegExp(name, 'i') }); // 'i' para case-insensitive
    
    if (!foundTeachers.length) {
      return res.status(404).json({ message: 'Nenhum professor encontrado com esse nome!' });
    }
    console.log('Professores encontrados com sucesso!');
    res.json({ message: 'Professores encontrados com sucesso!', foundTeachers });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Criar um novo professor
router.post('/', async (req, res) => {
  const { name, school_disciplines, contact, phone_number, status } = req.body;

  // Verifica se todos os campos obrigatórios foram enviados
  if (!name || !school_disciplines || !contact || !phone_number || !status) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios!' });
  }

  try {
    const newTeacher = new Teacher({ name, school_disciplines, contact, phone_number, status });
    await newTeacher.save();
    res.status(201).json(newTeacher);
  } catch (err) {
    console.error('Erro ao adicionar professor:', err.message);
    res.status(500).json({ message: 'Erro ao adicionar professor.', error: err.message });
  }
});

// Atualizar professor
router.put('/:id', async (req, res) => {
  const { id } = req.params;

  // Verifica se o ID é válido
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID inválido.' });
  }

  try {
    const updatedTeacher = await Teacher.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    if (!updatedTeacher) {
      return res.status(404).json({ message: 'Professor não encontrado.' });
    }

    res.status(200).json(updatedTeacher);
  } catch (err) {
    console.error('Erro ao atualizar professor:', err.message);
    res.status(500).json({ message: 'Erro ao atualizar professor.', error: err.message });
  }
});

// Deletar professor
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  // Verifica se o ID é válido
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID inválido.' });
  }

  try {
    const deletedTeacher = await Teacher.findByIdAndDelete(id);

    if (!deletedTeacher) {
      return res.status(404).json({ message: 'Professor não encontrado.' });
    }

    res.status(200).json(deletedTeacher);
  } catch (err) {
    console.error('Erro ao deletar professor:', err.message);
    res.status(500).json({ message: 'Erro ao deletar professor.', error: err.message });
  }
});

module.exports = router;