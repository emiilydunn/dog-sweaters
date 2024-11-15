import express from 'express';
import multer from 'multer';

const router = express.Router();

//Set up Multer for image handling 
//Routes
//Get all products
router.get('/all', (req, res) => {
    res.send('All Products');
});
//Purchase
router.get('/purchase', (req, res) => {
    res.send('Purchase');
});
//Get product by ID
router.get('/:id', (req, res) => {
    res.send('Product by ID');
});



export default router;