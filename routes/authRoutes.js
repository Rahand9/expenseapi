const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');

router.post('/signup', signup); // Route for signup
router.post('/login', login); // Route for login

module.exports = router;
