const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Conectar ao MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/bc', { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('connected', () => {
  console.log('MongoDB conectado');
});

// Schema e modelo para "professionals"
const professionalsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  contact: { type: String, required: true },
  phone_number: { type: String, required: true },
  status: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

const Professional = mongoose.model('Professional', professionalsSchema);

// ** Rotas para os profissionais **

// Retornar todos os profissionais
// GET "/professionals"
router.get('/', async (req, res) => {
  try {
    const professionals = await Professional.find();
    console.log('Profissionais encontrados com sucesso!');
    res.status(200).json(professionals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Retornar um profissional específico pelo ID
// GET "/professionals/:id"
router.get('/:id', async (req, res) => {
  const id = req.params.id;

  // Verifica se o ID é válido
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID inválido!' });
  }

  try {
    const professional = await Professional.findById(id);
    if (!professional) {
      return res.status(404).json({ message: 'Profissional não encontrado!' });
    }
    console.log('Profissional encontrado com sucesso!');
    res.status(200).json(professional);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Inserir um novo profissional
// POST "/professionals"
router.post('/', async (req, res) => {
  const { name, specialty, contact, phone_number, status } = req.body;

  // Verifica se todos os campos obrigatórios estão presentes
  if (!name || !specialty || !contact || !phone_number || !status) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios!' });
  }

  try {
    const newProfessional = new Professional({ name, specialty, contact, phone_number, status });
    await newProfessional.save();
    console.log('Profissional adicionado com sucesso!');
    res.status(201).json({ message: 'Profissional adicionado com sucesso!', newProfessional });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Atualizar dados de um profissional
// PUT "/professionals/:id"
router.put('/:id', async (req, res) => {
  const id = req.params.id;

  // Verifica se o ID é válido
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID inválido!' });
  }

  const { name, specialty, contact, phone_number, status } = req.body;

  try {
    const updatedProfessional = await Professional.findByIdAndUpdate(
      id,
      { name, specialty, contact, phone_number, status },
      { new: true, runValidators: true }
    );
    if (!updatedProfessional) {
      return res.status(404).json({ message: 'Profissional não encontrado!' });
    }
    console.log('Profissional atualizado com sucesso!');
    res.status(200).json({ message: 'Profissional atualizado com sucesso!', updatedProfessional });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Deletar um profissional
// DELETE "/professionals/:id"
router.delete('/:id', async (req, res) => {
  const id = req.params.id;

  // Verifica se o ID é válido
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID inválido!' });
  }

  try {
    const deletedProfessional = await Professional.findByIdAndDelete(id);
    if (!deletedProfessional) {
      return res.status(404).json({ message: 'Profissional não encontrado!' });
    }
    console.log('Profissional deletado com sucesso!');
    res.status(200).json({ message: 'Profissional deletado com sucesso!', deletedProfessional });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
