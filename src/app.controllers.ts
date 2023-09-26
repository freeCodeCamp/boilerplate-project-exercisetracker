import Express from "express"
import { createOrSaveUsernameToDb } from "./db/database";

export const getHtml = (_request: Express.Request, response: Express.Response) => {
    try {
        return response.status(200).sendFile(`${__dirname}/views/index.html`)
    }
    catch (err) {
        return response.status(500).json({ error: "unable to fetch static files" });
    }
}

export const requestCreateOrSaveUsernameToDb = async (request: Express.Request, response: Express.Response) => {
    const username: string = request.body.username
    try {
        const savedUsernameToDb = await createOrSaveUsernameToDb(username)
        return response.status(200).json(savedUsernameToDb)
    }
    catch (err) {
        return response.status(500).json({ error: "unable to post username" });
    }
}