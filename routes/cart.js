import express from "express";
import { z } from "zod";
import { getCart, addIteצ, addItem, deleteItem } from "./cart_controler.js";

const CUSTOMER_FILE = process.env.CUSTOMER_FILE;
const BOOKS_FILE = process.env.BOOKS_FILE;

export const router = express.Router();
router.use(express.json());

const validateItem = z.object({
    customerId: z.string().min(1),
    productId: z.number().int(),
    quantity: z.number().int().min(1),
});

router.get("/", getCart);

router.post("/items", addItem);

router.delete("/items/:productId", deleteItem);
