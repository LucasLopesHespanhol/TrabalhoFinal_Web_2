const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

// Função para carregar professores a partir do arquivo JSON
function loadTeachers() {
    try {
        return JSON.parse(fs.readFileSync('./src/db/teachers.json', 'utf8'));
    } catch (err) {
        return [];
    }
}

// Função para salvar professores no arquivo JSON
function saveTeachers(teachersDB) {
    try {
        fs.writeFileSync('./src/db/teachers.json', JSON.stringify(teachersDB, null, 2));
        return "Saved";
    } catch (err) {
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
 * 
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
 *     summary: Retorna uma lista de todos os professores
 *     tags: [Teachers]
 *     responses:
 *       200:
 *         description: A lista de professores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Teacher'
 */

// GET "/teachers"
router.get('/', (req, res) => {
    const teachersDB = loadTeachers();
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
router.get('/:id', (req, res) => {
    const id = req.params.id;
    const teachersDB = loadTeachers();
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
 *       200:
 *         description: O professor foi criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Teacher'
 */

// POST "/teachers" BODY { "name": "Judite Heeler" }
router.post('/', (req, res) => {
    const newTeacher = {
        id: uuidv4(),
        ...req.body
    };
    const teachersDB = loadTeachers();
    teachersDB.push(newTeacher);
    saveTeachers(teachersDB);
    res.json(newTeacher);
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

// PUT "/teachers/:id" BODY { "name": "Novo Nome" }
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const updatedTeacher = req.body;
    const teachersDB = loadTeachers();
    const currentTeacherIndex = teachersDB.findIndex((teacher) => teacher.id === id);
    if (currentTeacherIndex === -1) {
        return res.status(404).json({ erro: "Professor não encontrado!" });
    }
    teachersDB[currentTeacherIndex] = { ...teachersDB[currentTeacherIndex], ...updatedTeacher };
    saveTeachers(teachersDB);
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
 *       200:
 *         description: O professor foi removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Teacher'
 *       404:
 *         description: Professor não encontrado
 */

// DELETE "/teachers/:id"
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    const teachersDB = loadTeachers();
    const currentTeacherIndex = teachersDB.findIndex((teacher) => teacher.id === id);
    if (currentTeacherIndex === -1) {
        return res.status(404).json({ erro: "Professor não encontrado!" });
    }
    const deletedTeacher = teachersDB.splice(currentTeacherIndex, 1);
    saveTeachers(teachersDB);
    res.json(deletedTeacher);
});

module.exports = router;
