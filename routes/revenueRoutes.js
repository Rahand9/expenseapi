const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken');
const { createRevenue, getRevenues, updateRevenue, deleteRevenue } = require('../controllers/revenueController');

router.post('/', authenticateToken, createRevenue); // Route for creating revenue
router.get('/', authenticateToken, getRevenues); // Route for getting revenues
router.put('/:id', authenticateToken, updateRevenue); // Route for updating revenue
router.delete('/:id', authenticateToken, deleteRevenue); // Route for deleting revenue

module.exports = router;
