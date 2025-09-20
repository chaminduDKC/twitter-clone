// default type is commonjs which we can't use import export,
// set type:"module" to use import export

import express from 'express'
import dotenv from 'dotenv'

dotenv.config();

const PORT = process.env.PORT ;

const app = express();
console.log(PORT)

app.listen(PORT, ()=> console.log(`Server is up and on port ${PORT}`))