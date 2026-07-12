import express, { Router } from "express";
import { readFile, writeFile } from "../services/file_manager.js";
import { env } from "dotenv";
import { success, fail } from "../services/services.js";
import { number, z } from "zod";

env.config();
const CUSTOMER_FILE = process.env.CUSTOMER_FILE;
const BOOKS_FILE = process.env.BOOKS_FILE;

export const router = express.Router();
router.use(express.json());

const validateItem = z.object({
    customerId: z.string().min(1),
    productId: z.number().int(),
    quantity: z.number().int().min(1),
});

router.get("/", async (req, res) => {
    try {
        const customers = await readFile(CUSTOMER_FILE);
        const { customerId } = req.query;
        const customer = customers.find(
            (customer) => customer.customerId === customerId,
        );
        if (!customer)
            return res.status(404).send(fail(`id: ${customerId} not found`));

        res.send(success(customer.cart));
    } catch (err) {
        res.status(500).send(fail("internal server error"));
    }
});

router.post("/items", async (req, res) => {
    try {
        const customers = await readFile(CUSTOMER_FILE);
        const books = await readFile(BOOKS_FILE);

        const validItem = validateItem.safeParse(req.body);
        if (!validItem.success) {
            return res.status(400).send(fail(JSON.parse(validItem.error)));
        }

        const { customerId, productId, quantity } = validItem.data;

        const book = books.find((book) => book.id === productId);
        if (!book)
            return res.status(404).send(fail(`id: ${productId} not found`));

        const customer = customers.find(
            (customer) => customer.customerId === customerId,
        );
        if (!customer)
            return res.status(404).send(fail(`id: ${customerId} not found`));

        const cart = customer.cart;
        const item = cart.find((item) => item.productId === +productId);
        if (!item) cart.push({ productId, quantity });
        else item.quantity += quantity;

        const updatedItem = cart.find((item) => item.productId === +productId);
        if (updatedItem.quantity > book.stock)
            return res.status(400).send(fail("quantity out of stock"));

        await writeFile(CUSTOMER_FILE, customers);

        res.send(success("item added to cart"));
    } catch (err) {
        res.status(500).send(fail(err.message));
    }
});

router.delete("/items/:productId", (req, res) => {
    
})


