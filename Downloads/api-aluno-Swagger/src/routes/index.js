const express = require('express');
const router = express.Router();
const studentsRoutes = require('./studentsRoutes');
const teachersRoutes = require('./teachersRoutes');
const eventsRoutes = require('./eventsRoutes');
const appointmentsRoutes = require('./appointmentsRoutes');
const professionalsRoutes = require('./professionalsRoutes');
const usersRoutes = require('./usersRoutes');

// Middleware para o processamento de JSON
router.use(express.json());

// Roteamento para estudantes
router.use('/students', studentsRoutes);

// Roteamento para professores
router.use('/teachers', teachersRoutes);

// Roteamento para eventos
router.use('/events', eventsRoutes);

// Roteamento para appointments
router.use('/appointments', appointmentsRoutes);

// Roteamento para professionals
 router.use('/professionals', professionalsRoutes);

// Roteamento para users
router.use('/users', usersRoutes);

module.exports = router;
