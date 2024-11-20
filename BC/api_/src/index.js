const express = require('express');
const app = express();
const routes = require('./routes'); // Importando as rotas da pasta 'routes'

// Middleware para configurar as permissões de CORS (Cross-Origin Resource Sharing)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Permite todos os domínios
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Métodos permitidos
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Cabeçalhos permitidos
    res.setHeader('Content-Type', 'application/json'); // Tipo de conteúdo da resposta
    res.setHeader('Access-Control-Allow-Credentials', 'true'); // Permitir credenciais (cookies, etc)
    next();
});

// Middleware para processar JSON no corpo das requisições
app.use(express.json());

// Usando as rotas dentro de '/api'
app.use('/api', routes);

// Inicia o servidor na porta 8080
app.listen(8080, () => {
    console.log('Aplicação executando na porta 8080!');
});
