import express from 'express';
import cors from 'cors';
import usersRouter from './routes/users.js';
import productsRouter from './routes/products.js';

const port = process.env.PORT || 3000;
const app = express();

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
//CORS
app.use(cors());

//Routes
//Users
app.use('/api/users', usersRouter)

//Products
app.use('/api/products', productsRouter);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})