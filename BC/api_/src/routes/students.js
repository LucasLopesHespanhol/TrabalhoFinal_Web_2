const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Conectar ao MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/bc', { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('connected', () => {
  console.log('MongoDB conectado');
});

// Schema e modelo para "students"
const studentsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  parents: { type: String, required: true },
  phone_number: { type: String, required: true },
  special_needs: { type: String, default: null },
  status: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

const Student = mongoose.model('Student', studentsSchema);

// ** Rotas para os estudantes **

// Retornar todos os estudantes
// GET "/students"
router.get('/', async (req, res) => {
  try {
    const students = await Student.find();
    console.log('Estudantes encontrados com sucesso!');
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Retornar um estudante específico pelo ID
// GET "/students/:id"
router.get('/:id', async (req, res) => {
  const id = req.params.id;

  // Verifica se o ID é válido
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID inválido!' });
  }

  try {
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: 'Estudante não encontrado!' });
    }
    console.log('Estudante encontrado com sucesso!');
    res.status(200).json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Inserir um novo estudante
// POST "/students"
router.post('/', async (req, res) => {
  const { name, age, parents, phone_number, special_needs, status } = req.body;

  // Verificar se os campos obrigatórios estão presentes
  if (!name || !age || !parents || !phone_number || !status) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios!' });
  }

  try {
    const newStudent = new Student({ name, age, parents, phone_number, special_needs, status });
    await newStudent.save();
    console.log('Estudante adicionado com sucesso!');
    res.status(201).json({ message: 'Estudante adicionado com sucesso!', newStudent });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Atualizar dados de um estudante
// PUT "/students/:id"
router.put('/:id', async (req, res) => {
  const id = req.params.id;

  // Verifica se o ID é válido
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID inválido!' });
  }

  const { name, age, parents, phone_number, special_needs, status } = req.body;

  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { name, age, parents, phone_number, special_needs, status },
      { new: true, runValidators: true }
    );
    if (!updatedStudent) {
      return res.status(404).json({ message: 'Estudante não encontrado!' });
    }
    console.log('Estudante atualizado com sucesso!');
    res.status(200).json({ message: 'Estudante atualizado com sucesso!', updatedStudent });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Deletar um estudante
// DELETE "/students/:id"
router.delete('/:id', async (req, res) => {
  const id = req.params.id;

  // Verifica se o ID é válido
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID inválido!' });
  }

  try {
    const deletedStudent = await Student.findByIdAndDelete(id);
    if (!deletedStudent) {
      return res.status(404).json({ message: 'Estudante não encontrado!' });
    }
    console.log('Estudante deletado com sucesso!');
    res.status(200).json({ message: 'Estudante deletado com sucesso!', deletedStudent });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
