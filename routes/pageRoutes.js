const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/sag/register', (req, res) => {
    res.render('sag-register');
});

router.get('/sag/login', (req, res) => {
    res.render('sag-login');
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/login', (req, res) => {
    res.render('login');
});

module.exports = router;
