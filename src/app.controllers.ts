import Express from "express"
import { createAndSaveExerciseToDb, createOrSaveUsernameToDb, fetchAllUsers } from "./db/database";

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

export const getAllUsers = async (request: Express.Request, response: Express.Response) => {
    try {
        const allUsers = await fetchAllUsers()
        return response.status(200).send(allUsers)
    }
    catch (err) {
        return response.status(500).json({ error: "unable to fetch users" });
    }
}

export const postExerciseById = async (request: Express.Request, response: Express.Response) => {
    const userId = request.params
    const { description, duration, date } = request.body
    try {
        const savedExerciseData = await createAndSaveExerciseToDb(userId, description, duration, date)
        return response.status(200).json(savedExerciseData)
    }
    catch (err) {
        return response.status(500).json({ error: "unable to post exercise" });
    }
}