import express from 'express';
import cors from 'cors';
import usersRouter from './routes/users.js';
import productsRouter from './routes/products.js';
import purchaseRouter from './routes/purchase.js';
import session from 'express-session';

const port = process.env.PORT || 3000;
const app = express();

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//CORS
//Will add more middleware once we start front-end
app.use(cors({
    credentials: true
}));

//Express-session middleware 
app.use(session({
    secret: '0*nhfg-4svf^gdhfu76#Ra2A', //can be random
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: false,  // Set to `true` if using HTTPS in production
      sameSite: 'lax',  // Consider 'none' if client and server are on different origins
      maxAge: 7200000 // 2 hours in milliseconds
    }
  }));

//Routes
//Users
app.use('/api/users', usersRouter)

//Products
app.use('/api/products', productsRouter);

//Purchase
app.use('/api/purchase', purchaseRouter);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})