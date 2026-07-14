import express from "express";
import { getCart, addItem, deleteItem } from "../services/cart_controller.js";

export const router = express.Router();
router.use(express.json());


router.get("/", getCart);

router.post("/items", addItem);

router.delete("/items/:productId", deleteItem);
