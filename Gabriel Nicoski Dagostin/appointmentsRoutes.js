const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')
const fs = require('fs');

var appointmentsDB = loadAppointments();

// Função carrega compromissos a partir do arquivo JSON
function loadAppointments() {
    try {
      return JSON.parse(fs.readFileSync('./src/db/appointments.json', 'utf8'));
    } catch (err) {
      return [];
    }
}

// Função para salvar os compromissos no arquivo JSON
function saveAppointments() {
    try {
      fs.writeFileSync('./src/db/appointments.json', JSON.stringify(appointmentsDB, null, 2));
      return "Saved"
    } catch (err) {
      return "Not saved";
    }
}

/**
  * @swagger
 * components:
 *   schemas:
 *     Appointment:
 *       type: object
 *       required:
 *         - id
 *         - specialty
 *         - comments
 *         - date
 *         - student
 *         - professional
 *          
 *       properties:
 *         id:
 *           type: string
 *           description: O id é gerado automaticamente pelo cadastro do compromisso
 *         specialty:
 *           type: string
 *           description: Especialidade do profissional
 *         comments:
 *           type: string
 *           description: Comentários sobre o compromisso
 *         date:
 *           type: string
 *           format: date-time
 *           description: Data e hora do compromisso
 *         student:
 *           type: string
 *           description: Nome do estudante associado ao compromisso
 *         professional:
 *           type: string
 *           description: Nome do profissional associado ao compromisso
 * 
 *       example:
 *         id: 7a6cc1282c5f6ec0235acd2bfa780145aa2a67fd
 *         specialty: Fisioterapeuta
 *         comments: Realizar sessão
 *         date: 2023-08-15T16:00:00
 *         student: Bingo Heeler
 *         professional: Winton Blake
 */

 /**
  * @swagger
  * tags:
  *   name: Appointments
  *   description: 
  *     API de Controle de Compromissos
  *     **Por Gabriel Nicoski Dagostin**
  */

 /**
 * @swagger
 * /appointments:
 *   get:
 *     summary: Retorna uma lista de todos os compromissos
 *     tags: [Appointments]
 *     responses:
 *       200:
 *         description: A lista de compromissos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 */

// GET "/appointments"
router.get('/', (req, res) => {
    appointmentsDB = loadAppointments();
    res.json(appointmentsDB);
})

/**
 * @swagger
 * /appointments/{id}:
 *   get:
 *     summary: Retorna um compromisso pelo ID
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do compromisso
 *     responses:
 *       200:
 *         description: Um compromisso pelo ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: Compromisso não encontrado
 */

// GET "/appointments/{id}"
router.get('/:id', (req, res) => {
    const id = req.params.id;
    appointmentsDB = loadAppointments();
    const appointment = appointmentsDB.find((appointment) => appointment.id === id);
    if (!appointment) return res.status(404).json({ "erro": "Compromisso não encontrado!" });
    res.json(appointment);
})

/**
 * @swagger
 * /appointments:
 *   post:
 *     summary: Cria um novo compromisso
 *     tags: [Appointments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Appointment'
 *     responses:
 *       200:
 *         description: O compromisso foi criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 */

// POST "/appointments"
router.post('/', (req, res) => {
    const newAppointment = {
        id: uuidv4(),
        ...req.body
    };
    appointmentsDB = loadAppointments();
    appointmentsDB.push(newAppointment);
    let result = saveAppointments();
    console.log(result);
    return res.json(newAppointment);
})

/**
 * @swagger
 * /appointments/{id}:
 *  put:
 *    summary: Atualiza um compromisso pelo ID
 *    tags: [Appointments]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: ID do compromisso
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Appointment'
 *    responses:
 *      200:
 *        description: O compromisso foi atualizado com sucesso
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Appointment'
 *      404:
 *        description: Compromisso não encontrado
 */

// PUT "/appointments/{id}"
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const updatedAppointment = req.body;
    appointmentsDB = loadAppointments();
    const currentIndex = appointmentsDB.findIndex((appointment) => appointment.id === id);
    if (currentIndex === -1) return res.status(404).json({ "erro": "Compromisso não encontrado!" });
    
    appointmentsDB[currentIndex] = updatedAppointment;
    let result = saveAppointments();
    console.log(result);
    return res.json(updatedAppointment);
})

/**
 * @swagger
 * /appointments/{id}:
 *   delete:
 *     summary: Remove um compromisso pelo ID
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do compromisso
 *     responses:
 *       200:
 *         description: O compromisso foi removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: Compromisso não encontrado
 */

// DELETE "/appointments/{id}"
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    appointmentsDB = loadAppointments();
    const currentIndex = appointmentsDB.findIndex((appointment) => appointment.id === id);
    if (currentIndex === -1) return res.status(404).json({ "erro": "Compromisso não encontrado!" });
    
    const deleted = appointmentsDB.splice(currentIndex, 1);
    let result = saveAppointments();
    console.log(result);
    res.json(deleted);
})

module.exports = router;