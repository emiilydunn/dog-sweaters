import express from 'express';
import { PrismaClient } from '@prisma/client';


const router = express.Router();

const prisma = new PrismaClient();

//CRUD Operations
//Routes
//Get all products
router.get('/all', async (req, res) => {
    const products = await prisma.product.findMany()
    res.json(products);
});

//Get product by ID
router.get('/:id', async (req, res) => {
    const id = req.params.id;

    //Validate if ID is a number
    if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid ID. Please enter a number and try again.' })
    }

    //Check is ID is valid
    const products = await prisma.product.findUnique({
        where: {
            product_id: parseInt(id),
        },
    })

    //If statement to output valid/invalid ID
    if (products) {
        res.json(products);
    } else {
        res.status(404).json({message: 'Product not found. Please try again.'})
    }
});



//Purchase
router.get('/purchase', (req, res) => {
    res.send('Purchase');
});




export default router;