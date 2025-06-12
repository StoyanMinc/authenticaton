import express from 'express';
import userRouter from './routes/user-router.js';
import adminRouter from './routes/admin-router.js';

const router = express.Router();

router.use('/user', userRouter);
router.use('/admin', adminRouter);



export default router;