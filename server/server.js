import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import { connect } from "mongoose";
import connectDB from "./config/mongodb.js"; 
import authRouter from './routes/authRoutes.js';
import { sendVerifyOtp } from "./controllers/authController.js";
import userRouter from "./routes/userRoutes.js";


const app = express();
const port = process.env.PORT || 4000    // if port no. is defined into envvar then it will will be used otherwise 4000 used.
connectDB();
 
 const allowedOrigins = ['http://localhost:5173']

 app.use(express.json());     //all req are parsed using json
 app.use(cookieParser());  
 app.use(cors({origin:allowedOrigins, credentials: true}));    //we can send cookies in respone from express app

 app.post("/api/sendVerifyOtp", sendVerifyOtp);


 //API Endpoints
 app.get('/',  (req, res) => res.send("API working successfully"));
 app.use('/api/auth', authRouter)
 app.use('/api/user', userRouter)
 app.listen(port, ()=>console.log(`'Server started on PORT : ${port}`));   //whenever we will start the backend then this app will started and will print the msg in terminal 