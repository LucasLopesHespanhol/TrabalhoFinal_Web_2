const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises; // Usando promises para async/await

// Função para carregar professores a partir do arquivo JSON
async function loadTeachers() {
    try {
        const data = await fs.readFile('./src/db/teachers.json', 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error(err);
        return [];
    }
}

// Função para salvar professores no arquivo JSON
async function saveTeachers(teachersDB) {
    try {
        await fs.writeFile('./src/db/teachers.json', JSON.stringify(teachersDB, null, 2));
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
 *     Teacher:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - school_disciplines
 *         - contact
 *         - phone_number
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: O id é gerado automaticamente pelo cadastro do professor
 *         name:
 *           type: string
 *           description: Nome do professor
 *         school_disciplines:
 *           type: string
 *           description: Disciplinas que o professor leciona
 *         contact:
 *           type: string
 *           description: E-mail de contato do professor
 *         phone_number:
 *           type: string
 *           description: Número de telefone do professor
 *         status:
 *           type: string
 *           description: |
 *             "On" para ativo, "off" para inativo.
 *       example:
 *         id: 7a6cc1282c5f6ec0235acd2bfa780145aa2a67fd
 *         name: Henrique Milioli Ronchi
 *         school_disciplines: "Matematica"
 *         contact: "hiquemilioli@gmail.com"
 *         phone_number: "48 9999 9999"
 *         status: "On"
 */

/**
 * @swagger
 * tags:
 *   name: Teachers
 *   description: 
 *     API de Controle de Professores
 *     **Por Henrique Milioli Ronchi**
 */

/**
 * @swagger
 * /teachers:
 *   get:
 *     summary: Retorna uma lista de todos os professores ou filtra por nome
 *     tags: [Teachers]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Nome do professor para filtrar a lista
 *     responses:
 *       200:
 *         description: A lista de professores ou professores filtrados pelo nome
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Teacher'
 */

// GET "/teachers"
router.get('/', async (req, res) => {
    const { name } = req.query;
    const teachersDB = await loadTeachers();

    // Se um nome for fornecido, filtre os professores pelo nome
    if (name) {
        const filteredTeachers = teachersDB.filter(teacher => 
            teacher.name.toLowerCase().includes(name.toLowerCase())
        );
        return res.json(filteredTeachers);
    }

    // Se nenhum nome for fornecido, retorne todos os professores
    res.json(teachersDB);
});

/**
 * @swagger
 * /teachers/{id}:
 *   get:
 *     summary: Retorna um professor pelo ID
 *     tags: [Teachers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do professor
 *     responses:
 *       200:
 *         description: Um professor pelo ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Teacher'
 *       404:
 *         description: Professor não encontrado
 */

// GET "/teachers/:id"
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const teachersDB = await loadTeachers();
    const teacher = teachersDB.find((teacher) => teacher.id === id);
    if (!teacher) {
        return res.status(404).json({ erro: "Professor não encontrado!" });
    }
    res.json(teacher);
});

/**
 * @swagger
 * /teachers:
 *   post:
 *     summary: Cria um novo professor
 *     tags: [Teachers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Teacher'
 *     responses:
 *       201:
 *         description: O professor foi criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Teacher'
 */

// POST "/teachers"
router.post('/', async (req, res) => {
    const newTeacher = {
        id: uuidv4(),
        ...req.body
    };
    const teachersDB = await loadTeachers();
    teachersDB.push(newTeacher);
    await saveTeachers(teachersDB);
    res.status(201).json(newTeacher); // Retorna 201 para recurso criado
});

/**
 * @swagger
 * /teachers/{id}:
 *   put:
 *     summary: Atualiza um professor pelo ID
 *     tags: [Teachers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do professor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Teacher'
 *     responses:
 *       200:
 *         description: O professor foi atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Teacher'
 *       404:
 *         description: Professor não encontrado
 */

// PUT "/teachers/:id"
router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const updatedTeacher = req.body;
    const teachersDB = await loadTeachers();
    const currentTeacherIndex = teachersDB.findIndex((teacher) => teacher.id === id);
    if (currentTeacherIndex === -1) {
        return res.status(404).json({ erro: "Professor não encontrado!" });
    }
    teachersDB[currentTeacherIndex] = { ...teachersDB[currentTeacherIndex], ...updatedTeacher };
    await saveTeachers(teachersDB);
    res.json(teachersDB[currentTeacherIndex]);
});

/**
 * @swagger
 * /teachers/{id}:
 *   delete:
 *     summary: Remove um professor pelo ID
 *     tags: [Teachers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do professor
 *     responses:
 *       204:
 *         description: O professor foi removido com sucesso
 *       404:
 *         description: Professor não encontrado
 */

// DELETE "/teachers/:id"
router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    const teachersDB = await loadTeachers();
    const currentTeacherIndex = teachersDB.findIndex((teacher) => teacher.id === id);
    if (currentTeacherIndex === -1) {
        return res.status(404).json({ erro: "Professor não encontrado!" });
    }
    teachersDB.splice(currentTeacherIndex, 1);
    await saveTeachers(teachersDB);
    res.status(204).send(); // Retorna 204 para sem conteúdo
});

module.exports = router;
