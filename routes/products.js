import express from "express";
import { readFile, writeFile } from "../services/file_manager.js";
import env from "dotenv";
import { success, fail } from "../services/services.js";

env.config();
const BOOKS_FILE = process.env.BOOKS_FILE;

export const router = express.Router();

router.get("/", async (req, res) => {
    try {
        let books = await readFile(BOOKS_FILE);

        const { inStock, maxPrice, search } = req.query;
        if (inStock) books = books.filter((book) => book.stock > 0);
        if (maxPrice) books = books.filter((book) => book.price <= maxPrice);
        if (search)
            books = books.filter((book) =>
                book.name.toLowerCase().includes(search.toLowerCase()),
            );

        res.send(success(books));
    } catch (err) {
        res.status(500).send(fail("internal server error"));
    }
});
