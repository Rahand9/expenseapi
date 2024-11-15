const db = require('../knexfile.js');


// Create Expense
const createExpense = async (req, res) => {
    const { description, amount } = req.body;

    try {
        const [id] = await db('expenses').insert({ userId: req.user.id, description, amount });
        res.status(201).json({ id, userId: req.user.id, description, amount });
    } catch (error) {
        res.status(500).send('Error creating expense');
    }
};

// Get Expenses
const getExpenses = async (req, res) => {
    try {
        const userExpenses = await db('expenses').where({ userId: req.user.id });
        res.json(userExpenses);
    } catch (error) {
        res.status(500).send('Error getting expenses');
    }
};


// Update Expense
const updateExpense = async (req, res) => {
    const { id } = req.params;
    const { description, amount } = req.body;

    try {
        const result = await db('expenses').where({ id, userId: req.user.id }).update({ description, amount });
        if (result) {
            res.status(200).send('Expense updated');
        } else {
            res.status(404).send('Expense not found');
        }
    } catch (error) {
        res.status(500).send('Error updating expense');
    }
};

// Delete Expense
const deleteExpense = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db('expenses').where({ id, userId: req.user.id }).del();
        if (result) {
            res.status(200).send('Expense deleted');
        } else {
            res.status(404).send('Expense not found');
        }
    } catch (error) {
        res.status(500).send('Error deleting expense');
    }
};

module.exports = { createExpense, getExpenses, updateExpense, deleteExpense };