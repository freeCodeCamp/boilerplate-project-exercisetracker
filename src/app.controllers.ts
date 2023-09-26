import Express from "express"

export const getHtml = (_request: Express.Request, response: Express.Response) => {
    try {
        return response.status(200).sendFile(`${__dirname}/views/index.html`)
    }
    catch (err) {
        return response.status(500).json({ error: "unable to fetch static files" });
    }
}