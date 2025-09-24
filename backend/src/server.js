// default type is commonjs which we can't use import export,
// set type:"module" to use import export


import express from 'express'
import cors from "cors";
import { ENV } from "./config/env.config.js";
import { connectDB } from "./config/db.config.js";
import {clerkMiddleware} from "@clerk/express"
import userRoute from "./route/user.route.js"
import postRoute from "./route/post.route.js"
import commentRoute from "./route/comment.route.js"

const PORT = ENV.PORT;
const app = express();
app.use(cors({origin:ENV.FRONTEND_URL, credentials:true}));
app.use(express.json());
app.use(clerkMiddleware());

app.use("/api/users", userRoute)
app.use("/api/posts", postRoute)
app.use("/api/comments", commentRoute)

// middleware for err handling
app.use((err, req, res, next)=>{
    console.error("Unhandled error" + err)
    res.status(500).json({error:err || "Internal Server Error"})
})

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

