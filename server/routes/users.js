import express from 'express';
import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword } from '../library/utility.js';


const router = express.Router();

const prisma = new PrismaClient();


//CRUD Operations
//Signup
router.post('/signup', async (req, res) => {
    //Get customer/user input
    const { email, password, first_name, last_name } = req.body;

    //Validate inputs
    if (!email || !password || !first_name || !last_name) {
        return res.status(400).send('Missing required fields.');
    }

    //Check is user already exists
    const existingCustomer = await prisma.customer.findUnique({
        where: {
            email: email,
        }
    });
    if (existingCustomer) {
        return res.status(400).send('User already exists.');
    }

    //Hash password before we save it to the table
    const hashedPassword = await hashPassword(password);

    //Add user to the database
    const customer = await prisma.customer.create({
        data: {
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: hashedPassword
        }
    });

    //Send confirmation response
    res.json({ 'user': email })
});


//Login
router.post('/login', async (req, res) => {
    //Get user input
    const { email, password } = req.body;

    //Validate input
    if(!email || !password) {
        return res.status(400).send('Missing required fields.');
    }

    //Find user in the database
    const existingCustomer = await prisma.customer.findUnique({
        where: {
            email: email,
        }
    });
    if (!existingCustomer) {
        return res.status(404).send('User not found.');
    }

    //Compare/verify password
    const passwordMatch = await comparePassword(password, existingCustomer.password);
    if (!passwordMatch) {
        return res.status(401).send('Invalid password. Please try again.');
    }
    //Send response
    res.status(200).send(`User ${email} successfully logged in.`);
});









//Logout
router.get('/logout', (req, res) => {
    res.send('Logout');
});
//getSession
router.get('/getSession', (req, res) => {
    res.send('Get Session');
});

export default router;