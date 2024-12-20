import express from 'express';
import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword } from '../library/utility.js';
import passwordValidator from 'password-validator';


const router = express.Router();

const prisma = new PrismaClient();

//Password schema
const passwordSchema = new passwordValidator();

//Password schema
passwordSchema
    .is().min(8) //Min length 8
    .is().max(100) //Max length 100
    .has().uppercase() //Must have uppercase letter
    .has().lowercase() //Must have lowercase letter
    .has().digits(1) //Must have 1 number
    .has().not().spaces();


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

    //Check if password is valid
    const isValidPassword = passwordSchema.validate(password);
    if (!isValidPassword) {
        //If password fails, send custom error message
        const failedValidations = passwordSchema.validate(password, { list: true });

        switch (failedValidations[0]) {
            case 'min':
                return res.status(400).send('Password must be at least 8 characters long.');
            case 'max':
                return res.status(400).send('Password must be no more than 100 characters.');
            case 'uppercase':
                return res.status(400).send('Password must include at least one uppercase letter.');
            case 'lowercase':
                return res.status(400).send('Password must include at least one lowercase letter.');
            case 'digits':
                return res.status(400).send('Password must include at least one number.');
            case 'spaces':
                return res.status(400).send('Password  cannot contain spaces');
        }
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
    if (!email || !password) {
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

    //Setup user session
    //Store user email in session, and ass customer_id, email, first_name, and last_name to the session.
    req.session.customer_id = existingCustomer.customer_id;
    req.session.email = existingCustomer.email;
    req.session.first_name = existingCustomer.first_name;
    req.session.last_name = existingCustomer.last_name;

    //Send response
    res.status(200).send(`User ${email} successfully logged in.`);
});

//getSession
router.get('/getSession', (req, res) => {
    //Check if session exists
    if (req.session && req.session.email) {
        res.json({
            customer_id: req.session.customer_id,
            email: req.session.email,
            first_name: req.session.first_name,
            last_name: req.session.last_name,
        });
    } else {
        res.status(401).send('No user logged in. Please try again.');
    }

});

//Logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: 'You have successfully logged out.' });
});


export default router;

