import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import userRoutes from './handlers/users';
import productRoutes from './handlers/products';
import orderRoutes from './handlers/orders';



dotenv.config();

const app: express.Application = express();
const PORT = process.env.PORT || 3000;
const address: string = "0.0.0.0:3000";

app.use(bodyParser.json());

userRoutes(app);
productRoutes(app);
orderRoutes(app);




app.listen(PORT, () =>{
    console.log(`server listening on port ${address}`);
});

export default app;



