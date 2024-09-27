const express = require('express');
const router = express.Router();
const studentsRoutes = require('./studentsRoutes');
const teachersRoutes = require('./teachersRoutes');

// Middleware para o processamento de JSON
router.use(express.json());

// Roteamento para estudantes
router.use('/students', studentsRoutes);

// Roteamento para professores
router.use('/teachers', teachersRoutes);

module.exports = router;
