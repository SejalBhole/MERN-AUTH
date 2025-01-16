import express from 'express';
import { getuserData } from '../controllers/userController.js';
import userAuth from '../middleware/userAuth.js';



const userRouter = express.Router();

userRouter.get('/data', userAuth , getuserData);

export default userRouter;