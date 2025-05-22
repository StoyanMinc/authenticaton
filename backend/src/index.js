import express from 'express';
import cors from 'cors';
import {config} from 'dotenv';
config();

const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

try {
    app.listen(port, () => {
        console.log(`Server is listening on port ${port}...`);
    }); 
} catch (error) {
    console.log(`Error starting server: ${error}`);
}