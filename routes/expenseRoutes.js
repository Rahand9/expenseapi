const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken');
const { createExpense, getExpenses, updateExpense, deleteExpense } = require('../controllers/expenseController');

router.post('/', authenticateToken, createExpense); // Route for creating expense
router.get('/', authenticateToken, getExpenses); // Route for getting expenses
router.put('/:id', authenticateToken, updateExpense); // Route for updating expense
router.delete('/:id', authenticateToken, deleteExpense); // Route for deleting expense

module.exports = router;
