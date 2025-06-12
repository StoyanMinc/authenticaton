import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './db/connect.js';
import router from './router.js';
config();

const port = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', router);

app.get('/api', (req, res) => {
    res.send('ok');
})
const server = async () => {
    try {
        await connectDB();
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}...`);
        });
    } catch (error) {
        console.log(`Error starting server: ${error}`);
    }
}

server();
