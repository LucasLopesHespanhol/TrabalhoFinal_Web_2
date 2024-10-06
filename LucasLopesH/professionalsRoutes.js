const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

// Função para carregar os profissionais a partir do arquivo JSON
function loadProfessionals() {
    try {
        return JSON.parse(fs.readFileSync('./src/db/professionals.json', 'utf8'));
    } catch (err) {
        return [];
    }
}

// Função para salvar os profissionais no arquivo JSON
function saveProfessionals(professionalsDB) {
    try {
        fs.writeFileSync('./src/db/professionals.json', JSON.stringify(professionalsDB, null, 2));
        return "Saved";
    } catch (err) {
        return "Not saved";
    }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Professional:
 *       type: object
 *       required:
 *         - id
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: O id é gerado automaticamente pelo cadastro do profissional
 *         name:
 *           type: string
 *           description: Nome do Profissional
 *         specialty:
 *           type: string
 *           description: Especialidade do Profissional
 *         contact:
 *           type: string
 *           description: Contato do Profissional
 *         phone_number:
 *           type: string
 *           description: Número de telefone do Profissional
 *         status:
 *           type: string
 *           description: Status do Profissional
 *       example:
 *         id: 7a6cc1282c5f6ec0235acd2bfa780145aa2a67fd
 *         name: Winton Blake
 *         specialty: Fisioterapeuta
 *         contact: wb.fisio@gmail.com
 *         phone_number: 48 9696 5858
 *         status: on
 */

/**
 * @swagger
 * tags:
 *   name: Professionals
 *   description: API de Controle de Profissionais
 */

/**
 * @swagger
 * /professionals:
 *   get:
 *     summary: Retorna uma lista de todos os profissionais
 *     tags: [Professionals]
 *     responses:
 *       200:
 *         description: A lista de profissionais
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Professional'
 */

// GET "/professionals"
router.get('/', (req, res) => {
    const professionalsDB = loadProfessionals();
    res.json(professionalsDB);
});

/**
 * @swagger
 * /professionals/{id}:
 *   get:
 *     summary: Retorna um profissional pelo ID
 *     tags: [Professionals]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do profissional
 *     responses:
 *       200:
 *         description: Um profissional pelo ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Professional'
 *       404:
 *         description: Profissional não encontrado
 */

// GET "/professionals/:id"
router.get('/:id', (req, res) => {
    const id = req.params.id;
    const professionalsDB = loadProfessionals();
    const professional = professionalsDB.find(p => p.id === id);
    if (!professional) {
        return res.status(404).json({ "erro": "Profissional não encontrado!" });
    }
    res.json(professional);
});

/**
 * @swagger
 * /professionals:
 *   post:
 *     summary: Cria um novo profissional
 *     tags: [Professionals]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Professional'
 *     responses:
 *       201:
 *         description: O profissional foi criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Professional'
 */

// POST "/professionals"
router.post('/', (req, res) => {
    const newProfessional = {
        id: uuidv4(),
        ...req.body
    };
    const professionalsDB = loadProfessionals();
    professionalsDB.push(newProfessional);
    saveProfessionals(professionalsDB);
    res.status(201).json(newProfessional);
});

/**
 * @swagger
 * /professionals/{id}:
 *   put:
 *     summary: Atualiza um profissional pelo ID
 *     tags: [Professionals]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do profissional
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Professional'
 *     responses:
 *       200:
 *         description: O profissional foi atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Professional'
 *       404:
 *         description: Profissional não encontrado
 */

// PUT "/professionals/:id"
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const professionalsDB = loadProfessionals();
    const index = professionalsDB.findIndex(p => p.id === id);
    if (index === -1) {
        return res.status(404).json({ "erro": "Profissional não encontrado!" });
    }
    professionalsDB[index] = { id, ...req.body };
    saveProfessionals(professionalsDB);
    res.json(professionalsDB[index]);
});

/**
 * @swagger
 * /professionals/{id}:
 *   delete:
 *     summary: Remove um profissional pelo ID
 *     tags: [Professionals]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do profissional
 *     responses:
 *       200:
 *         description: O profissional foi removido com sucesso
 *       404:
 *         description: Profissional não encontrado
 */

// DELETE "/professionals/:id"
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    const professionalsDB = loadProfessionals();
    const index = professionalsDB.findIndex(p => p.id === id);
    if (index === -1) {
        return res.status(404).json({ "erro": "Profissional não encontrado!" });
    }
    const deletedProfessional = professionalsDB.splice(index, 1);
    saveProfessionals(professionalsDB);
    res.json(deletedProfessional);
});

module.exports = router;
