import mongoose, { HydratedDocument, connect, model } from "mongoose";
import { response } from "express";
require("dotenv").config();

// 1. defining the type (shape) of the env variables
type EnvVariables = {
    MONGO_URI: string;
};

// 2. creating an interface representing a document in MongoDB
interface Username {
    username: string;
    versionKey: false;
}

// 3. create a schema corresponding to the document (rows) interface
const usernameSchema = new mongoose.Schema<Username>(
    {
        username: { type: String, required: true },
    },
    { versionKey: false },
);

// 4. create a model - this allows you to create instances of your objects, called documents
const Username = model<Username>("Username", usernameSchema);

// 5. connecting to mongoDB
connect((process.env as EnvVariables).MONGO_URI);

// 6. checking if user inputted url is already in db
export const createOrSaveUsernameToDb = async (username: string) => {
    // 7. if it is, return that one already saved to the user
    const foundUsername = await Username.findOne({ username });
    let savedUsername: Username;
    if (foundUsername) {
        savedUsername = await foundUsername.save();
        return savedUsername;
    }
    // 8. otherwise, creating a new instance of a username and saving to db
    else {
        let newUsername: HydratedDocument<Username> = new Username({ username });
        savedUsername = await newUsername.save();
        const foundNewlySavedUsername = await Username.findOne(
            { username }
        );
        return foundNewlySavedUsername;
    }
}

export const fetchAllUsers = async () => {
    const fetchedUsers = await Username.find()
    return fetchedUsers
}