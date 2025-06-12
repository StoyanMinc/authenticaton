import express from 'express';
import { adminMiddleware, creatorMiddleware, protect } from '../middlewares/protect.js';
import { deleteUser, getAllUsers } from '../controllers/adminController.js';

const adminRouter = express.Router();

adminRouter.delete('/delete-user/:id', protect, adminMiddleware, deleteUser);
adminRouter.get('/get-users', protect, creatorMiddleware, getAllUsers)

export default adminRouter;