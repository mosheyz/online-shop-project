import express from "express";
import env from "dotenv";
import { router as booksRouter } from "./routes/products.js";
import { router as cartRouter } from "./routes/cart.js";
import { success, fail } from "./services/services.js";

env.config();
const PORT = process.env.PORT;
const server = express();

server.use("/products", booksRouter);
server.use("/cart", cartRouter);

server.get("/health", (req, res) => {
    res.send(success("Server work's"));
});

server.get("/", (req, res) => {
    res.send(success("Wellcome to my online-shop API!"));
});

server.listen(PORT, () => console.log("server is listening"));
