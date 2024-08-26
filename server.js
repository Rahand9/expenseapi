require('dotenv').config(); // this is to manage environment variables 

const express = require('express');
const app = express();

const authRoutes = require('./routes/authRoutes'); // Authentication routes
const expenseRoutes = require('./routes/expenseRoutes'); // Expense routes
const revenueRoutes = require('./routes/revenueRoutes'); // Revenue routes

app.use(express.json()); // 

// port
const PORT = process.env.PORT || 5500;

app.use('/auth', authRoutes); // Routes for authentication
app.use('/expenses', expenseRoutes); // Routes for expense 
app.use('/revenues', revenueRoutes); // Routes for revenue 

//starting the server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
