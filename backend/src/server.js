// default type is commonjs which we can't use import export,
// set type:"module" to use import export


import express from 'express'
import cors from "cors";
import { ENV } from "./config/env.config.js";
import { connectDB } from "./config/db.config.js";
import {clerkMiddleware} from "@clerk/express"
import userRoute from "./route/user.route.js"

const PORT = ENV.PORT;
const app = express();
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

app.use("/api/users", userRoute)

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

