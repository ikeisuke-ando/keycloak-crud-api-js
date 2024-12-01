import { Router } from "express";
import keycloak from "../keycloak.js";

const router = Router();

let books = [];

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Gerenciamento de Livros
 */

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Retorna todos os livros
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: Lista de livros
 */
router.get("/", keycloak.protect(),(req, res) => {
    res.json(books);
});

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: Retorna um livro pelo ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do livro
 *     responses:
 *       200:
 *         description: Livro encontrado
 *       404:
 *         description: Livro não encontrado
 */
router.get("/:id", keycloak.protect(),(req, res) => {
    const book = books.find((b) => b.id === parseInt(req.params.id));
    if (!book) return res.status(404).json({ error: "Livro não encontrado" });
    res.json(book);
});

/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Adiciona um novo livro
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               year:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Livro criado com sucesso
 */
router.post("/", keycloak.protect(),(req, res) => {
    const { title, author, year } = req.body;
    const newBook = { id: books.length + 1, title, author, year };
    books.push(newBook);
    res.status(201).json(newBook);
});

/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     summary: Atualiza um livro existente
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               year:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Livro atualizado com sucesso
 *       404:
 *         description: Livro não encontrado
 */
router.put("/:id", keycloak.protect(),(req, res) => {
    const book = books.find((b) => b.id === parseInt(req.params.id));
    if (!book) return res.status(404).json({ error: "Livro não encontrado" });

    const { title, author, year } = req.body;
    book.title = title || book.title;
    book.author = author || book.author;
    book.year = year || book.year;

    res.json(book);
});

/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     summary: Exclui um livro
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       204:
 *         description: Livro excluído com sucesso
 *       404:
 *         description: Livro não encontrado
 */
router.delete("/:id", keycloak.protect(),(req, res) => {
    const bookIndex = books.findIndex((b) => b.id === parseInt(req.params.id));
    if (bookIndex === -1) return res.status(404).json({ error: "Livro não encontrado" });
    books.splice(bookIndex, 1);
    res.status(204).send();
});

export default router;