import express from "express";
import keycloak from "../keycloak.js";
import { Book } from "../models/book.js";

const router = express.Router();

router.post("/", keycloak.protect(), async (req, res) => {
    const { title, author } = req.body;
    const userId = req.kauth.grant.access_token.content.sub;

    try {
        const newBook = new Book({
            title,
            author,
            userId,
        });
        await newBook.save();
        res.status(201).json(newBook);
    } catch (error) {
        res.status(500).json({ message: "Erro ao salvar o livro", error });
    }
});

router.put("/:id", keycloak.protect(), async (req, res) => {
    const { id } = req.params;
    const { title, author } = req.body;
    const userId = req.kauth.grant.access_token.content.sub;

    try {
        const book = await Book.findById(id);

        if (book.userId !== userId) {
            return res.status(403).json({ message: "Você não tem permissão para editar este livro." });
        }

        book.title = title;
        book.author = author;
        await book.save();
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ message: "Erro ao editar o livro", error });
    }
});

router.delete("/:id", keycloak.protect(), async (req, res) => {
    const { id } = req.params;
    const userId = req.kauth.grant.access_token.content.sub;

    try {
        const book = await Book.findById(id);

        if (book.userId !== userId) {
            return res.status(403).json({ message: "Você não tem permissão para excluir este livro." });
        }

        await book.remove();
        res.status(200).json({ message: "Livro excluído com sucesso!" });
    } catch (error) {
        res.status(500).json({ message: "Erro ao excluir o livro", error });
    }
});

export default router;