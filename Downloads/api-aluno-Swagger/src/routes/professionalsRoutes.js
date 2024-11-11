const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises; // Usando promises para async/await

// Função para carregar os profissionais a partir do arquivo JSON
async function loadProfessionals() {
    try {
        const data = await fs.readFile('./src/db/professionals.json', 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error(err);
        return [];
    }
}

// Função para salvar os profissionais no arquivo JSON
async function saveProfessionals(professionalsDB) {
    try {
        await fs.writeFile('./src/db/professionals.json', JSON.stringify(professionalsDB, null, 2));
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
 *     **Por Lucas Lopes Hespanhol**
 */

/**
 * @swagger
 * /professionals:
 *   get:
 *     summary: Retorna uma lista de todos os profissionais ou filtra por nome
 *     tags: [Professionals]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Nome do profissional para filtrar a lista
 *     responses:
 *       200:
 *         description: A lista de profissionais ou profissionais filtrados pelo nome
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Professional'
 */

// GET "/professionals"
router.get('/', async (req, res) => {
    const { name } = req.query;
    let professionalsDB = await loadProfessionals();

    // Se um nome for fornecido, filtre os profissionais pelo nome
    if (name) {
        const filteredProfessionals = professionalsDB.filter(professional =>
            professional.name.toLowerCase().includes(name.toLowerCase())
        );
        return res.json(filteredProfessionals);
    }

    // Se nenhum nome for fornecido, retorne todos os profissionais
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
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const professionalsDB = await loadProfessionals();
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
router.post('/', async (req, res) => {
    const newProfessional = {
        id: uuidv4(),
        ...req.body
    };
    const professionalsDB = await loadProfessionals();
    professionalsDB.push(newProfessional);
    await saveProfessionals(professionalsDB);
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
router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const professionalsDB = await loadProfessionals();
    const index = professionalsDB.findIndex(p => p.id === id);
    if (index === -1) {
        return res.status(404).json({ "erro": "Profissional não encontrado!" });
    }
    professionalsDB[index] = { id, ...req.body };
    await saveProfessionals(professionalsDB);
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
 *       204:
 *         description: O profissional foi removido com sucesso
 *       404:
 *         description: Profissional não encontrado
 */

// DELETE "/professionals/:id"
router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    const professionalsDB = await loadProfessionals();
    const index = professionalsDB.findIndex(p => p.id === id);
    if (index === -1) {
        return res.status(404).json({ "erro": "Profissional não encontrado!" });
    }
    professionalsDB.splice(index, 1);
    await saveProfessionals(professionalsDB);
    res.status(204).send(); // Retorna 204 para sem conteúdo
});

module.exports = router;
