const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/knex');


//Signup
const signup = async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const [id] = await db('users').insert({ username, password: hashedPassword });
        res.status(201).send('User created');
    } catch (error) {
        res.status(500).send('Error creating the user');
    }
};

// Login
const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await db('users').where({ username }).first();
        if (!user) return res.status(400).send('Invalid input');

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).send('Invalid input');

        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET);
        res.header('Authorization', token).send({ token });
    } catch (error) {
        res.status(500).send('Error logging in');
    }
};

module.exports = { signup, login };
