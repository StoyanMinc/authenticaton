import express from 'express';
import {
    changePassword,
    checkLoginStatus,
    forgotPassword,
    getUser,
    login,
    logout,
    register,
    resetPassword,
    updateUser,
    verifyEmail,
    verifyUser

} from '../controllers/userController.js';
import { protect } from '../middlewares/protect.js';

const userRouter = express.Router();

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.get('/logout', logout);
userRouter.get('/check-login', checkLoginStatus);
userRouter.get('/get-user', protect, getUser);
userRouter.put('/update-user', protect, updateUser);
userRouter.post('/verify-email', protect, verifyEmail);
userRouter.post('/verify-user/:verificationToken', protect, verifyUser);
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/reset-password/:resetPasswordToken', resetPassword);
userRouter.put('/change-password', protect, changePassword);

export default userRouter;