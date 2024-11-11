const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises; // Usando promises para async/await

// Função para carregar eventos a partir do arquivo JSON
async function loadEvents() {
    try {
        const data = await fs.readFile('./src/db/events.json', 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error(err);
        return [];
    }
}

// Função para salvar eventos no arquivo JSON
async function saveEvents(eventsDB) {
    try {
        await fs.writeFile('./src/db/events.json', JSON.stringify(eventsDB, null, 2));
        return "Saved";
    } catch (err) {
        console.error(err);
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
 *       example:
 *         id: "7a6cc1282c5f6ec0235acd2bfa780145aa2a67fd"
 *         description: "Palestra bem viver com saúde"
 *         comments: "Profissionais de saúde da Unesc"
 *         date: "2023-08-15T16:00:00"
 */

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: API de Controle de Eventos
 *     **Por Henrique Milioli Ronchi**
 */

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Retorna uma lista de todos os eventos ou busca por descrição
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: description
 *         schema:
 *           type: string
 *         description: Descrição do evento para busca
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
router.get('/', async (req, res) => {
    const { description } = req.query;
    let eventsDB = await loadEvents();

    // Se uma descrição for fornecida, filtra os eventos
    if (description) {
        const filteredEvents = eventsDB.filter(event =>
            event.description.toLowerCase().includes(description.toLowerCase())
        );
        return res.json(filteredEvents);
    }

    // Se nenhuma descrição for fornecida, retorna todos os eventos
    res.json(eventsDB);
});

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

// GET "/events/:id"
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const eventsDB = await loadEvents();
    const event = eventsDB.find(event => event.id === id);
    if (!event) {
        return res.status(404).json({ erro: "Evento não encontrado!" });
    }
    res.json(event);
});

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
 *       201:
 *         description: O evento foi criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 */

// POST "/events"
router.post('/', async (req, res) => {
    const newEvent = {
        id: uuidv4(),
        ...req.body
    };
    const eventsDB = await loadEvents();
    eventsDB.push(newEvent);
    await saveEvents(eventsDB);
    res.status(201).json(newEvent); // Retorna 201 para recurso criado
});

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

// PUT "/events/:id"
router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const updatedEvent = req.body;
    const eventsDB = await loadEvents();
    const currentIndex = eventsDB.findIndex(event => event.id === id);
    if (currentIndex === -1) {
        return res.status(404).json({ erro: "Evento não encontrado!" });
    }
    eventsDB[currentIndex] = { ...eventsDB[currentIndex], ...updatedEvent }; // Atualiza o evento mantendo o ID
    await saveEvents(eventsDB);
    res.json(eventsDB[currentIndex]);
});

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
 *       204:
 *         description: O evento foi removido com sucesso
 *       404:
 *         description: Evento não encontrado
 */

// DELETE "/events/:id"
router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    const eventsDB = await loadEvents();
    const currentIndex = eventsDB.findIndex(event => event.id === id);
    if (currentIndex === -1) {
        return res.status(404).json({ erro: "Evento não encontrado!" });
    }
    eventsDB.splice(currentIndex, 1);
    await saveEvents(eventsDB);
    res.status(204).send(); // Retorna 204 para sem conteúdo
});

module.exports = router;
