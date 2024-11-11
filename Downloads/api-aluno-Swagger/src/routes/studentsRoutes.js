const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises; // Usando promises para async/await

// Função para carregar estudantes a partir do arquivo JSON
async function loadStudents() {
    try {
        const data = await fs.readFile('./src/db/students.json', 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error(err);
        return [];
    }
}

// Função para salvar estudantes no arquivo JSON
async function saveStudents(studentsDB) {
    try {
        await fs.writeFile('./src/db/students.json', JSON.stringify(studentsDB, null, 2));
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
 *     Student:
 *       type: object
 *       required:
 *         - id
 *         - nome
 *         - age
 *         - parents
 *         - phone_number
 *         - special_needs
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: O id é gerado automaticamente pelo cadastro do estudante
 *         nome:
 *           type: string
 *           description: Nome do Estudante
 *         age:
 *           type: integer
 *           description: Idade do Estudante
 *         parents:
 *           type: array
 *           description: Nomes dos responsáveis pelo estudante
 *           items:
 *             type: string
 *         phone_number:
 *           type: string
 *           description: Número de telefone do estudante ou responsável
 *         special_needs:
 *           type: string
 *           description: Descrição das necessidades especiais do estudante
 *         status:
 *           type: string
 *           description: |
 *             "On" para ativo, "off" para inativo.
 *       example:
 *         id: afr0b6d0-a69b-4938-b116-f2e8e0d08542
 *         nome: Andre Faria Ruaro
 *         age: 10
 *         parents: 
 *           - Carlos Ruaro
 *           - Maria Faria
 *         phone_number: "(11) 98765-4321"
 *         special_needs: "Dificuldade auditiva"
 *         status: "On"
 */

/**
 * @swagger
 * tags:
 *   name: Students
 *   description: 
 *     API de Controle de Estudantes
 *     **Por Henrique Milioli Ronchi**
 */

/**
 * @swagger
 * /students:
 *   get:
 *     summary: Retorna uma lista de todos os estudantes ou filtra por nome
 *     tags: [Students]
 *     parameters:
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *         description: Nome do estudante para filtrar a lista
 *     responses:
 *       200:
 *         description: A lista de estudantes ou estudantes filtrados pelo nome
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Student'
 */

// GET "/students"
router.get('/', async (req, res) => {
    const { nome } = req.query;
    let studentsDB = await loadStudents();

    // Se um nome for fornecido, filtre os estudantes pelo nome
    if (nome) {
        const filteredStudents = studentsDB.filter(student =>
            student.nome.toLowerCase().includes(nome.toLowerCase())
        );
        return res.json(filteredStudents);
    }

    // Se nenhum nome for fornecido, retorne todos os estudantes
    res.json(studentsDB);
});

/**
 * @swagger
 * /students/{id}:
 *   get:
 *     summary: Retorna um estudante pelo ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do estudante
 *     responses:
 *       200:
 *         description: Um estudante pelo ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       404:
 *         description: Estudante não encontrado
 */

// GET "/students/:id"
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const studentsDB = await loadStudents();
    const student = studentsDB.find((student) => student.id === id);
    if (!student) {
        return res.status(404).json({ erro: "Aluno não encontrado!" });
    }
    res.json(student);
});

/**
 * @swagger
 * /students:
 *   post:
 *     summary: Cria um novo estudante
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       201:
 *         description: O estudante foi criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 */

// POST "/students"
router.post('/', async (req, res) => {
    const newStudent = {
        id: uuidv4(),
        ...req.body
    };
    const studentsDB = await loadStudents();
    studentsDB.push(newStudent);
    await saveStudents(studentsDB);
    res.status(201).json(newStudent); // Retorna 201 para recurso criado
});

/**
 * @swagger
 * /students/{id}:
 *   put:
 *     summary: Atualiza um estudante pelo ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do estudante
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       200:
 *         description: O estudante foi atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       404:
 *         description: Estudante não encontrado
 */

// PUT "/students/:id"
router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const updatedStudent = req.body;
    const studentsDB = await loadStudents();
    const currentIndex = studentsDB.findIndex((student) => student.id === id);
    if (currentIndex === -1) {
        return res.status(404).json({ erro: "Aluno não encontrado!" });
    }
    studentsDB[currentIndex] = { ...studentsDB[currentIndex], ...updatedStudent };
    await saveStudents(studentsDB);
    res.json(studentsDB[currentIndex]);
});

/**
 * @swagger
 * /students/{id}:
 *   delete:
 *     summary: Remove um estudante pelo ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do estudante
 *     responses:
 *       204:
 *         description: O estudante foi removido com sucesso
 *       404:
 *         description: Estudante não encontrado
 */

// DELETE "/students/:id"
router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    const studentsDB = await loadStudents();
    const currentIndex = studentsDB.findIndex((student) => student.id === id);
    if (currentIndex === -1) {
        return res.status(404).json({ erro: "Aluno não encontrado!" });
    }
    studentsDB.splice(currentIndex, 1);
    await saveStudents(studentsDB);
    res.status(204).send(); // Retorna 204 para sem conteúdo
});

module.exports = router;
