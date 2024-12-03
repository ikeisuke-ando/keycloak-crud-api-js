import express from "express";
import keycloak from "../keycloak.js";

const router = express.Router();

let books = [];

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Retorna a lista de livros do usuário autenticado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de livros
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   author:
 *                     type: string
 *                   userId:
 *                     type: string
 *       500:
 *         description: Erro interno ao buscar livros
 */
router.get("/", keycloak.protect(), (req, res) => {
    const userId = req.kauth.grant.access_token.content.sub;

    try {
        const userBooks = books.filter((book) => book.userId === userId);
        res.status(200).json(userBooks);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar os livros", error });
    }
});

/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Adiciona um novo livro para o usuário autenticado
 *     security:
 *       - bearerAuth: []
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
 *     responses:
 *       201:
 *         description: Livro adicionado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 author:
 *                   type: string
 *                 userId:
 *                   type: string
 *       500:
 *         description: Erro interno ao salvar o livro
 */
router.post("/", keycloak.protect(), (req, res) => {
    const { title, author } = req.body;
    const userId = req.kauth.grant.access_token.content.sub;

    try {
        const newBook = {
            id: books.length + 1,
            title,
            author,
            userId,
        };

        books.push(newBook);
        res.status(201).json(newBook);
    } catch (error) {
        res.status(500).json({ message: "Erro ao salvar o livro", error });
    }
});

/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     summary: Atualiza um livro existente do usuário autenticado
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do livro a ser atualizado
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
 *     responses:
 *       200:
 *         description: Livro atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 author:
 *                   type: string
 *                 userId:
 *                   type: string
 *       403:
 *         description: Usuário não tem permissão para editar este livro
 *       404:
 *         description: Livro não encontrado
 *       500:
 *         description: Erro interno ao atualizar o livro
 */
router.put("/:id", keycloak.protect(), (req, res) => {
    const { id } = req.params;
    const { title, author } = req.body;
    const userId = req.kauth.grant.access_token.content.sub;

    try {
        const book = books.find((b) => b.id === parseInt(id));

        if (!book) {
            return res.status(404).json({ message: "Livro não encontrado." });
        }

        if (book.userId !== userId) {
            return res.status(403).json({ message: "Você não tem permissão para editar este livro." });
        }

        book.title = title;
        book.author = author;

        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ message: "Erro ao editar o livro", error });
    }
});

/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     summary: Exclui um livro do usuário autenticado
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do livro a ser excluído
 *     responses:
 *       200:
 *         description: Livro excluído com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       403:
 *         description: Usuário não tem permissão para excluir este livro
 *       404:
 *         description: Livro não encontrado
 *       500:
 *         description: Erro interno ao excluir o livro
 */
router.delete("/:id", keycloak.protect(), (req, res) => {
    const { id } = req.params;
    const userId = req.kauth.grant.access_token.content.sub;

    try {
        const bookIndex = books.findIndex((b) => b.id === parseInt(id));

        if (bookIndex === -1) {
            return res.status(404).json({ message: "Livro não encontrado." });
        }

        if (books[bookIndex].userId !== userId) {
            return res.status(403).json({ message: "Você não tem permissão para excluir este livro." });
        }

        books.splice(bookIndex, 1);
        res.status(200).json({ message: "Livro excluído com sucesso!" });
    } catch (error) {
        res.status(500).json({ message: "Erro ao excluir o livro", error });
    }
});

export default router;