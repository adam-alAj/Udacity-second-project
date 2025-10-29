import express from 'express';
import cors from 'cors';
import client from './db';


const app = express();

app.use(cors());
app.use(express.json());

//Health check
app.get('/ping', async (req, res )=>{
    try{
        // quick db check
        const result = await client.query('SELECT 1+1 as result');
        res.json({ok: true, db: result.rows[0].result});
    }catch (err){
        res.status(500).json({ok: false, error: 'DB connection failed', detail: err});
    }
});


export default app;