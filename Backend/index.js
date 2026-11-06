import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDB from "./utils/db.js";
import userRoutes from "./routes/user.routes.js";
dotenv.config({});
const app = express();


//middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
    // optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
const PORT =process.env.PORT || 3000;

//api routes
app.use("/api/v1/user",userRoutes);


app.listen(PORT,()=>{
    connectDB();
    console.log(`Server is running on port ${PORT}`);});