import express from "express";
import dotenv from "dotenv";
import keycloak, { memoryStore } from "./keycloak.js";
import session from "express-session";
import booksRoutes from "./routes/books.js";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Configuração da sessão
app.use(
    session({
        secret: "1234567890",
        resave: false,
        saveUninitialized: true,
        store: memoryStore,
        cookie: { maxAge: 60 * 60 * 1000 },
    })
);

// Configuração do Keycloak
app.use(
    keycloak.middleware({
        logout: "/logout",
        admin: "/",
    })
);

// Configuração do Body Parser
app.use(express.json());

// Configuração do Swagger
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API CRUD com Keycloak",
            version: "1.0.0",
            description: "API para CRUD de Tarefas e Livros com proteção por Keycloak",
        },
        servers: [
            {
                url: `http://localhost:${port}`,
            },
        ],
    },
    apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rotas
app.use("/api/books", booksRoutes);

// Rota de teste
app.get("/", (req, res) => {
    res.send("API funcionando! Acesse /api-docs para a documentação Swagger.");
});

// Inicialização do servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
    console.log(`Documentação disponível em http://localhost:${port}/api-docs`);
});
