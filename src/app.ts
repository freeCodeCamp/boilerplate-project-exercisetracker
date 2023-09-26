import express from "express";
import cors from "cors";
export const app = express();

app.use(cors())
app.use("/public", express.static('public'))
app.use(express.urlencoded({ extended: true }));

app.get('/', (request, response) => {
    response.sendFile(`${__dirname}/src/views/index.html`)
});