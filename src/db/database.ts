import mongoose, { connect, model } from "mongoose";

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