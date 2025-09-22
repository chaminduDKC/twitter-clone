// default type is commonjs which we can't use import export,
// set type:"module" to use import export

import express from 'express'
import { ENV } from "./config/env.config.js";
import { connectDB } from "./config/db.config.js";

const PORT = ENV.PORT;

const app = express();

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server is up and run on port ${PORT}`)
        })
    } catch (error) {
        logger.error("Error in starting server", error);
        process.exit(1);
    }

}
startServer();

