import express from "express"
import env from "dotenv"


env.config()
const PORT = process.env.PORT

const server = express()


server.get("/health", (req, res) => {
    res.send({
        mesage: "Server work's"
    })
})

server.get("/", (req, res) => {
    res.send({
        message: "Wellcome to my online-shop API!"
    })
})


server.listen(PORT, () => console.log("server is listening"))