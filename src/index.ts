import cors from 'cors';
import express from 'express';
import { connectDatabase } from './utils/connectDatabase';

const app = express();

app.use(express.json());
app.use(cors());

connectDatabase().then(() => {
    app.listen(5005, async () => {
        console.log('Listening on port: 5005...');
    });
})
