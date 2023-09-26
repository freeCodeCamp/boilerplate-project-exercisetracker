import express from "express";
import cors from "cors";
import { getHtml } from "./app.controllers";
export const app = express();

app.use(cors())
app.use("/public", express.static('public'))
app.use(express.urlencoded({ extended: true }));

app.get('/', getHtml);