const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises; // Usando promises para async/await

// Função para carregar usuários a partir do arquivo JSON
async function loadUsers() {
    try {
        const data = await fs.readFile('./src/db/users.json', 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error(err);
        return [];
    }
}

// Função para salvar os usuários no arquivo JSON
async function saveUsers(usersDB) {
    try {
        await fs.writeFile('./src/db/users.json', JSON.stringify(usersDB, null, 2));
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
 *     **Por Guilherme Rosso Cardoso**
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retorna uma lista de todos os usuários ou filtra por nome
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Nome do usuário para filtrar a lista
 *     responses:
 *       200:
 *         description: A lista de usuários ou usuários filtrados pelo nome
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */

// GET "/users"
router.get('/', async (req, res) => {
    const { name } = req.query;
    let usersDB = await loadUsers();

    // Se um nome for fornecido, filtre os usuários pelo nome
    if (name) {
        const filteredUsers = usersDB.filter(user =>
            user.name.toLowerCase().includes(name.toLowerCase())
        );
        return res.json(filteredUsers);
    }

    // Se nenhum nome for fornecido, retorne todos os usuários
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
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const usersDB = await loadUsers();
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
 *       201:
 *         description: O usuário foi criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */

// POST "/users"
router.post('/', async (req, res) => {
    const newUser = {
        id: uuidv4(),
        ...req.body
    };
    const usersDB = await loadUsers();
    usersDB.push(newUser);
    await saveUsers(usersDB);
    res.status(201).json(newUser); // Retorna 201 para recurso criado
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
router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const updatedUser = req.body;
    const usersDB = await loadUsers();
    const currentIndex = usersDB.findIndex((user) => user.id === id);
    if (currentIndex === -1) {
        return res.status(404).json({ erro: "Usuário não encontrado!" });
    }
    usersDB[currentIndex] = { ...usersDB[currentIndex], ...updatedUser };
    await saveUsers(usersDB);
    res.json(usersDB[currentIndex]);
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
 *       204:
 *         description: O usuário foi removido com sucesso
 *       404:
 *         description: Usuário não encontrado
 */

// DELETE "/users/:id"
router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    const usersDB = await loadUsers();
    const currentIndex = usersDB.findIndex((user) => user.id === id);
    if (currentIndex === -1) {
        return res.status(404).json({ erro: "Usuário não encontrado!" });
    }
    usersDB.splice(currentIndex, 1);
    await saveUsers(usersDB);
    res.status(204).send(); // Retorna 204 para sem conteúdo
});

module.exports = router;
