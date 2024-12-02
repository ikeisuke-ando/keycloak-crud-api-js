import express from "express";
import dotenv from "dotenv";
import keycloak from "./keycloak.js";
import booksRoutes from "./routes/books.js";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(keycloak.middleware());

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
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use("/api/books", booksRoutes);

app.get("/", (req, res) => {
    res.send("API funcionando! Acesse /api-docs para a documentação Swagger.");
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
    console.log(`Documentação disponível em http://localhost:${port}/api-docs`);
});
