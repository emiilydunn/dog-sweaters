import express from 'express';

const router = express.Router();

//Routes
//Signup
router.get('/signup', (req, res) => {
    res.send('Sign-Up');
});
//Login
router.get('/login', (req, res) => {
    res.send('Login');
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