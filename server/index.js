import express from 'express'
import dotenv from 'dotenv'
import mongodb from './db.js'
import cors from 'cors';

import employeerouter from './routers/employeerouter.js'
import cookieParser from 'cookie-parser'
import attendencerouter from './routers/attendencerouter.js';
import adminrouter from './routers/adminrouter.js';


const app=express()
dotenv.config()

app.use(cors(
    {
        origin: "http://localhost:3000", // Allow frontend
        credentials: true, // Allow cookies
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"]
      }
));

app.use(express.json())
app.use(cookieParser())

app.use('/api/authemp',employeerouter);
app.use('/api/attendence',attendencerouter);
app.use('/api/admin',adminrouter)


mongodb();
const port=process.env.PORT ;

app.listen(port,()=>{
    console.log(`Server is running in the Port ${port}`);
})