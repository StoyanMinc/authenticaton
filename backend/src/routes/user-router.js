import express from 'express';
import { checkLoginStatus, getUser, login, logout, register, updateUser } from '../controllers/userController.js';
import { protect } from '../middlewares/protect.js';

const userRouter = express.Router();

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.get('/logout', logout);
userRouter.get('/check-login', checkLoginStatus);
userRouter.get('/get-user', protect, getUser);
userRouter.put('/update-user', protect, updateUser);

export default userRouter;