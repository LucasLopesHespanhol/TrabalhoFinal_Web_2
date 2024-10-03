const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

var usersDB = loadUsers();

// Função para carregar usuários a partir do arquivo JSON
function loadUsers() {
    try {
        return JSON.parse(fs.readFileSync('./src/db/users.json', 'utf8'));
    } catch (err) {
        return [];
    }
}

// Função para salvar os usuários no arquivo JSON
function saveUsers() {
    try {
        fs.writeFileSync('./src/db/users.json', JSON.stringify(usersDB, null, 2));
        return "Saved";
    } catch (err) {
        return "Not saved";
    }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - email
 *         - user
 *         - pwd
 *         - level
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: ID do usuário
 *         name:
 *           type: string
 *           description: Nome do usuário
 *         email:
 *           type: string
 *           description: Email do usuário
 *         user:
 *           type: string
 *           description: Username
 *         pwd:
 *           type: string
 *           description: Senha do usuário
 *         level:
 *           type: string
 *           description: Nível do usuário (admin ou comum)
 *         status:
 *           type: string
 *           description: Status do usuário (on ou off)
 *       example:
 *         id: eee123
 *         name: Guilherme
 *         email: gui@unesc.net
 *         user: gui123
 *         pwd: eee123
 *         level: admin
 *         status: on
 */

 /**
  * @swagger
  * tags:
  *   name: Users
  *   description: API de Controle de Usuários
  */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retorna uma lista de todos os usuários
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A lista de usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */

// GET "/users"
router.get('/', (req, res) => {
    console.log("getroute");
    usersDB = loadUsers();
    res.json(usersDB);
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Retorna um usuário pelo ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Um usuário pelo ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuário não encontrado
 */

// GET "/users/:id"
router.get('/:id', (req, res) => {
    const id = req.params.id;
    usersDB = loadUsers();
    const user = usersDB.find((user) => user.id === id);
    if (!user) return res.status(404).json({ "erro": "Usuário não encontrado!" });
    res.json(user);
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: O usuário foi criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */

// POST "/users"
router.post('/', (req, res) => {
    const newUser = {
        id: uuidv4(),
        ...req.body
    };
    console.log(newUser);
    usersDB = loadUsers();
    usersDB.push(newUser);
    let result = saveUsers();
    console.log(result);
    return res.json(newUser);
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Atualiza um usuário pelo ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: O usuário foi atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuário não encontrado
 */

// PUT "/users/:id"
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const newUser = req.body;
    usersDB = loadUsers();
    const currentUser = usersDB.find((user) => user.id === id);
    const currentIndex = usersDB.findIndex((user) => user.id === id);
    if (!currentUser) return res.status(404).json({ "erro": "Usuário não encontrado!" });
    usersDB[currentIndex] = newUser;
    let result = saveUsers();
    console.log(result);
    return res.json(newUser);
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Remove um usuário pelo ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: O usuário foi removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuário não encontrado
 */

// DELETE "/users/:id"
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    usersDB = loadUsers();
    const currentUser = usersDB.find((user) => user.id === id);
    const currentIndex = usersDB.findIndex((user) => user.id === id);
    if (!currentUser) return res.status(404).json({ "erro": "Usuário não encontrado!" });
    const deletedUser = usersDB.splice(currentIndex, 1);
    let result = saveUsers();
    console.log(result);
    res.json(deletedUser);
});

module.exports = router;
