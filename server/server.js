import express from 'express';
import cors from 'cors';

const port = process.env.PORT || 3000;
const app = express();

//Middleware
//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
//CORS
app.use(cors());

//Routes
//Testing
app.send('Hello Dog Sweaters');

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})