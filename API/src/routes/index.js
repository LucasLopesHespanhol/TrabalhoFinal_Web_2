const express = require('express');
const router = express.Router();

// Importando os arquivos de rotas para os modelos
const compromissos = require('./appointments');  // Rotas para compromissos
const eventos = require('./events');            // Rotas para eventos
const profissionais = require('./professionals'); // Rotas para profissionais
const estudantes = require('./students');        // Rotas para estudantes
const teachers = require('./teachers');       // Alterado para 'teachers'
const users = require('./users');

// Middleware para processar JSON
router.use(express.json());

// Definindo as rotas para cada recurso
router.use('/appointments', compromissos);
router.use('/events', eventos);
router.use('/professionals', profissionais);
router.use('/students', estudantes);
router.use('/teachers', teachers);  // Mantido como '/teachers'
router.use('/users', users);

// Exportando o roteador
module.exports = router;
