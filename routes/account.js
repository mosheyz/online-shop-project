import express from "express";
import { readFile } from "../services/file_manager.js";
import { success, fail } from "../services/services.js";

const CUSTOMER_FILE = process.env.CUSTOMER_FILE;

export const router = express.Router();

router.get("/balance", async (req, res) => {
    try {
        const { customerId } = req.query;
        if (!customerId) {
            return res.status(400).send(fail("customerId is required"));
        }

        const customers = await readFile(CUSTOMER_FILE);
        const customer = customers.find(
            (customer) => customer.customerId === customerId,
        );

        if (!customer) {
            return res.status(404).send(fail(`id: ${customerId} not found`));
        }

        res.send(success({ balance: customer.balance }));
    } catch (err) {
        res.status(500).send(fail("internal server error"));
    }
});
