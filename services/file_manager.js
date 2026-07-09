import fs from "fs/promises"


export const readFile = (fileName) => fs.readFile(fileName, "utf-8").then(data => JSON.parse(data))

export const writeFile = (fileName, data) => fs.writeFile(fileName, JSON.stringify(data, null, 2))