// default type is commonjs which we can't use import export,
// set type:"module" to use import export

import express from 'express'
import {ENV} from "./config/env.config.js";
import {connectDB} from "./config/db.config.js";

const PORT = ENV.PORT;

const app = express();
connectDB().then(()=>{
    app.listen(PORT, ()=> {
        console.log(`Server is up and run on port ${PORT}`)
    })
});
