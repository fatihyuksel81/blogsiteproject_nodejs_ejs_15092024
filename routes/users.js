const express = require('express');

const router = express.Router();
const userController = require('../controllers/userController');

router.get('/login', (req, res) => {
    const message = req.flash('message');
    res.render('login', {message});
});
router.get('/register', (req, res) => {
    const message = req.flash('message');
    res.render('register', {message});
});
router.get('/logout', userController.logout);

router.post('/register', userController.register);
router.post('/login', userController.login);


module.exports = router;