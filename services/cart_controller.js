import { readFile, writeFile } from "./file_manager.js";
import { success, fail } from "./services.js";
import { z } from "zod";

const CUSTOMER_FILE = process.env.CUSTOMER_FILE;
const BOOKS_FILE = process.env.BOOKS_FILE;

const validateItem = z.object({
    customerId: z.string().min(1),
    productId: z.number().int(),
    quantity: z.number().int().min(1),
});

export const getCart = async (req, res) => {
    try {
        const { customerId } = req.query;
        if (!customerId) {
            return res
                .status(400)
                .send(fail("customerId query parameter is required"));
        }

        const customers = await readFile(CUSTOMER_FILE);
        const customer = customers.find(
            (customer) => customer.customerId === customerId,
        );
        if (!customer)
            return res.status(404).send(fail(`id: ${customerId} not found`));

        res.send(success(customer.cart));
    } catch (err) {
        res.status(500).send(fail("internal server error"));
    }
};

export const addItem = async (req, res) => {
    try {
        const validItem = validateItem.safeParse(req.body);
        if (!validItem.success) {
            return res.status(400).send(fail(JSON.parse(validItem.error)));
        }

        const { customerId, productId, quantity } = validItem.data;

        const customers = await readFile(CUSTOMER_FILE);
        const books = await readFile(BOOKS_FILE);

        const book = books.find((book) => book.id === productId);
        if (!book)
            return res.status(404).send(fail(`id: ${productId} not found`));

        let customer = customers.find(
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
};

export const deleteItem = async (req, res) => {
    try {
        const { productId } = req.params;
        const { customerId } = req.body;

        if (!customerId) {
            return res
                .status(400)
                .send(fail("customerId is required in request body"));
        }

        const customers = await readFile(CUSTOMER_FILE);
        const customer = customers.find((c) => c.customerId === customerId);

        if (!customer) {
            return res.status(404).send(fail(`id: ${customerId} not found`));
        }

        const item = customer.cart.find(
            (item) => item.productId === +productId,
        );

        if (!item) {
            return res
                .status(404)
                .send(fail(`product id: ${productId} not found`));
        }

        customer.cart = customer.cart.filter(
            (item) => item.productId !== +productId,
        );

        await writeFile(CUSTOMER_FILE, customers);
        res.send(success("item deleted from cart"));
    } catch (err) {
        res.status(500).send(fail("internal server error"));
    }
};
