const express = require('express');
const app = express();
const cors = require("cors");

// Middleware para habilitar CORS
app.use(cors());

// Configuração do Swagger
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

// Importa as rotas
const routes = require('./routes');

const hostname = '127.0.0.1';
const port = 3000;

// Configurações do Swagger
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Aluno",
            version: "1.0.0",
            description: `API Aluno via Swagger.  
            
            ### TD 01    
            Disciplina: DAII 2024.02 Turma 01  
            Equipe: Teck Inside: 
            Henrique Milioli Ronchi, Guilherme Rosso Cardoso, Lucas Lopes Hespanhol,
            Davi de Stéfani de Souza e Gabriel Nicoski Dagostin. 
            `,
            license: {
                name: 'Licenciado para DAII',
            },
            contact: {
                name: 'Henrique Milioli Ronchi'
            },
        },
        servers: [
            {
                url: "http://localhost:3000/api/",
                description: 'Development server',
            },
        ],
    },
    apis: ["./src/routes/*.js"],
};

const specs = swaggerJsDoc(options);

// Usando as rotas
app.use('/api', routes);

// Configurando o Swagger UI
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

// Inicia o servidor
app.listen(port, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
