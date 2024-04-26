import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";


import authRoutes from "./routes/auth.routes.js"
import messageRoutes from "./routes/message.routes.js"
import userRoutes from "./routes/user.routes.js"

import mongooseConnection from "./db/connectToMongoDb.js";
import { app, server } from "./socket/socket.js";



dotenv.config();
const PORT = process.env.PORT || 5000 ;


// app.get ("/", (req,res)=>{
//     res.json ("this is the backend")
// })


app.use(express.json());
app.use(cookieParser());
app.use("/api/auth",authRoutes)
app.use("/api/messages",messageRoutes);
app.use("/api/users",userRoutes);


server.listen(PORT , (req,res) => {
    mongooseConnection();
    console.log(`Connected to port ${PORT}`)
})