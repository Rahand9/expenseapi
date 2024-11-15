const db = require('../knexfile.js');


// Create Revenue
const createRevenue = async (req, res) => {
    const { description, amount } = req.body;

    try {
        const [id] = await db('revenues').insert({ userId: req.user.id, description, amount });
        res.status(201).json({ id, userId: req.user.id, description, amount });
    } catch (error) {
        res.status(500).send('Error creating revenue');
    }
};

// Get Revenues
const getRevenues = async (req, res) => {
    try {
        const userRevenues = await db('revenues').where({ userId: req.user.id });
        res.json(userRevenues);
    } catch (error) {
        res.status(500).send('Error fetching revenues');
    }
};

// Update Revenue
const updateRevenue = async (req, res) => {
    const { id } = req.params;
    const { description, amount } = req.body;

    try {
        const result = await db('revenues').where({ id, userId: req.user.id }).update({ description, amount });
        if (result) {
            res.status(200).send('Revenue updated');
        } else {
            res.status(404).send('Revenue not found');
        }
    } catch (error) {
        res.status(500).send('Error updating revenue');
    }
};

// Delete Revenue
const deleteRevenue = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db('revenues').where({ id, userId: req.user.id }).del();
        if (result) {
            res.status(200).send('Revenue deleted');
        } else {
            res.status(404).send('Revenue not found');
        }
    } catch (error) {
        res.status(500).send('Error deleting revenue');
    }
};

module.exports = { createRevenue, getRevenues, updateRevenue, deleteRevenue };