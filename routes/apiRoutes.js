const express = require('express');
const router = express.Router();
const { register, login, confirmEmail, createAdmin } = require('../controllers/authController');
const auth = require('../middlewares/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/confirm-email', confirmEmail);
router.post('/create-admin', auth, createAdmin);

module.exports = router;
