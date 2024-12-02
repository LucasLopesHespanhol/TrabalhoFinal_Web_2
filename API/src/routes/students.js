const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Conectar ao MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/bc', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB students conectado');
});

// Schema e modelo para "students"
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  parents: { type: String, required: true },
  phone_number: { type: String, required: true },
  special_needs: { type: String, default: null },
  status: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

const Student = mongoose.model('Student', studentSchema);

// Rotas

// Buscar estudantes por nome ou listar todos
router.get('/', async (req, res) => {
  const { name } = req.query;
  try {
    const students = name
      ? await Student.find({ name: new RegExp(name, 'i') })
      : await Student.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar estudantes', error: error.message });
  }
});

// Buscar estudantes por intervalo de datas
router.get('/date', async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({ message: 'Datas de início e fim são obrigatórias' });
  }

  try {
    const start = new Date(`${startDate}T00:00:00Z`);
    const end = new Date(`${endDate}T23:59:59Z`);
    const students = await Student.find({
      created_at: { $gte: start, $lte: end },
    });
    res.status(200).json({ foundStudents: students });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar por intervalo de datas', error: error.message });
  }
});

// Buscar estudante por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID inválido' });
  }

  try {
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: 'Estudante não encontrado' });
    }
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar estudante', error: error.message });
  }
});

// Adicionar estudante
router.post('/', async (req, res) => {
  const { name, age, parents, phone_number, special_needs, status } = req.body;

  if (!name || !age || !parents || !phone_number || !status) {
    return res.status(400).json({ message: 'Todos os campos obrigatórios devem ser preenchidos' });
  }

  try {
    const newStudent = new Student({ name, age, parents, phone_number, special_needs, status });
    await newStudent.save();
    res.status(201).json({ message: 'Estudante criado com sucesso', student: newStudent });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar estudante', error: error.message });
  }
});

// Atualizar estudante
router.put('/:id', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID inválido' });
  }

  const { name, age, parents, phone_number, special_needs, status } = req.body;

  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { name, age, parents, phone_number, special_needs, status },
      { new: true, runValidators: true }
    );
    if (!updatedStudent) {
      return res.status(404).json({ message: 'Estudante não encontrado' });
    }
    res.status(200).json({ message: 'Estudante atualizado com sucesso', student: updatedStudent });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar estudante', error: error.message });
  }
});

// Deletar estudante
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID inválido' });
  }

  try {
    const deletedStudent = await Student.findByIdAndDelete(id);
    if (!deletedStudent) {
      return res.status(404).json({ message: 'Estudante não encontrado' });
    }
    res.status(200).json({ message: 'Estudante deletado com sucesso', student: deletedStudent });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar estudante', error: error.message });
  }
});

module.exports = router;