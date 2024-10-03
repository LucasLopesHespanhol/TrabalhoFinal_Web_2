const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')
const fs = require('fs');

var eventsDB = loadEvents();

// Função carrega eventos a partir do arquivo JSON
function loadEvents() {
    try {
        return JSON.parse(fs.readFileSync('./src/db/events.json', 'utf8'));
    } catch (err) {
        return [];
    }
}

// Função para salvar os eventos no arquivo JSON
function saveEvents() {
    try {
        fs.writeFileSync('./src/db/events.json', JSON.stringify(eventsDB, null, 2));
        return "Saved";
    } catch (err) {
        return "Not saved";
    }
}

/**
  * @swagger
  * components:
  *   schemas:
  *     Event:
  *       type: object
  *       required:
  *         - id
  *         - description
  *         - comments
  *         - date
  *          
  *       properties:
  *         id:
  *           type: string
  *           description: O id é gerado automaticamente pelo cadastro do evento
  *         description:
  *           type: string
  *           description: Descrição do Evento
  *         comments:
  *           type: string
  *           description: Comentários adicionais sobre o evento
  *         date:
  *           type: string
  *           format: date-time
  *           description: Data e hora do evento
  * 
  *       example:
  *         id: "7a6cc1282c5f6ec0235acd2bfa780145aa2a67fd"
  *         description: "Palestra bem viver com saúde"
  *         comments: "Profissionais de saúde da Unesc"
  *         date: "2023-08-15 16:00:00"
  */

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: API de Controle de Eventos
 */

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Retorna uma lista de todos os eventos
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: A lista de eventos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 */

// GET "/events"
router.get('/', (req, res) => {
    console.log("getroute");
    eventsDB = loadEvents();
    res.json(eventsDB);
})

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Retorna um evento pelo ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do evento
 *     responses:
 *       200:
 *         description: Um evento pelo ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Evento não encontrado
 */

// GET "/events/1"
router.get('/:id', (req, res) => {
    const id = req.params.id;
    eventsDB = loadEvents();
    var event = eventsDB.find((event) => event.id === id);
    if (!event) return res.status(404).json({ "erro": "Evento não encontrado!" });
    res.json(event);
})

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Cria um novo evento
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       200:
 *         description: O evento foi criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 */

// POST "/events"
router.post('/', (req, res) => {
    const newEvent = {
        id: uuidv4(),
        ...req.body
    };
    console.log(newEvent);
    eventsDB = loadEvents();
    eventsDB.push(newEvent);
    let result = saveEvents();
    console.log(result);
    return res.json(newEvent);
})

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Atualiza um evento pelo ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do evento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       200:
 *         description: O evento foi atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Evento não encontrado
 */

// PUT "/events/{id}"
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const updatedEvent = req.body;
    eventsDB = loadEvents();
    const currentEvent = eventsDB.find((event) => event.id === id);
    const currentIndex = eventsDB.findIndex((event) => event.id === id);
    if (!currentEvent) return res.status(404).json({ "erro": "Evento não encontrado!" });
    eventsDB[currentIndex] = updatedEvent;
    let result = saveEvents();
    console.log(result);
    return res.json(updatedEvent);
})

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Remove um evento pelo ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do evento
 *     responses:
 *       200:
 *         description: O evento foi removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Evento não encontrado
 */

// DELETE "/events/{id}"
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    eventsDB = loadEvents();
    const currentEvent = eventsDB.find((event) => event.id === id);
    const currentIndex = eventsDB.findIndex((event) => event.id === id);
    if (!currentEvent) return res.status(404).json({ "erro": "Evento não encontrado!" });
    const deletedEvent = eventsDB.splice(currentIndex, 1);
    let result = saveEvents();
    console.log(result);
    res.json(deletedEvent);
})

module.exports = router;
