import express from 'express';
import { getUser, login, logout, register, updateUser } from '../controllers/userController.js';
import { protect } from '../middlewares/protect.js';

const userRouter = express.Router();

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.get('/logout', logout);
userRouter.get('/get-user', protect, getUser);
userRouter.put('/update-user', protect, updateUser);

export default userRouter;