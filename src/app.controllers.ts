import Express from "express"

export const getHtml = (_request: Express.Request, response: Express.Response) => {
    try {
        return response.status(200).sendFile(`${__dirname}/views/index.html`)
    }
    catch (err) {
        return response.status(500).json({ error: "unable to fetch static files" });
    }
}

export const createAndSaveUsername = (request: Express.Request, response: Express.Response) => {
    const username: string = request.body.username
    try {
        return response.status(200).json(username)
    }
    catch (err) {
        return response.status(500).json({ error: "unable to post username" });
    }
}