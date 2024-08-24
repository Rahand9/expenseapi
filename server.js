require('dotenv').config();

const express = require('express');
const app = express();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const knex = require('knex');
const knexConfig = require('./knexfile');
const db = knex(knexConfig.development);




app.use(express.json());

// jwt key (more research needed)
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in the environment variables');
}


// port
const PORT = process.env.PORT || 5500;


let users = [];
let expenses = [];
let revenues = [];
let currentUserId = null;



// Middleware to authenticate using JWT (need more study on this)
function authenticateToken(req, res, next) {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) return res.status(401).send('Access Denied');

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).send('Invalid Token');
    }
}

//Signup
app.post('/signup', async (req, res) => {
    //async in here makes the progam wait until the password is hashed (connected to await down below)
    const { username, password } = req.body;
    //req.body has the data sent by the user so it can reach us hence we = it to username and password
    const hashedPassword = await bcrypt.hash(password, 10);
    //hashing is converting data like a password into a fixed size string of characters (it is more of a security thing so that it is hard to reverse engineer)
    /*await in here makes sure it waits so that the password is hashed (password, 10) in here the first part is what u want to be hased in our case the meaning in the variable password
    and the number 10 is the salt rounds (for simplicity the higher the number the more secure the data (password) will be but will make the processing time more*/
    

    const user = { id: users.length + 1, username, password: hashedPassword };
    /*in here we make the user variable with 3 properties giving  the id to our new user but + 1 
    (so if we have 100 users and a new user signs up they will get the 101 id)
    the other 2 properties it gives the username and the hashespassword that was done above to this user 
    */
   // in here we can't just say hashedPassword like we say username because javascript has an shorthand for username but not password
    users.push(user);
    // this pushes the new user into our array of registerd user confirming the new user as registered
    res.status(201).send('User created');
});
    // 201 status is for when u want to say a new resource has been created on the server (in our casethe users creations)
    //.send sends a message the user saying user created

// Login
app.post('/login', async (req, res) => {
    //app.post makes the route (in this case login) so when a post request is made in here it does the probided function below
    // keep in mind after async we don't but comma unlike 'authenticateToken' which w do down below
    const { username, password } = req.body;
    //same as above
    const user = users.find(u => u.username === username);
    //.find is for searching in here we say user.find so it searches the user array and it comesback until the above requirement is met
    // u in this case stands for user (using u or user makes no difference)
    //our requirement is that the username (the ones stored in our array) must equal the u.username(the input of the user) 
    

    if (!user) return res.status(400).send('Invalid input');
    //this part is if the user is not fond 
    //400 means bad request means the user has inputed something that our server cannot process 

    const validPassword = await bcrypt.compare(password, user.password);
    //check to see if the password enter by the user(user.password) matches the password stored in our program
    if (!validPassword) return res.status(400).send('Invalid input');
    

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);
    //jwt.sign makes a signed token for users data
    //{ id: user.id, username: user.username } this part is the payload we store the id username into the token this can be used later to identify users
    // jwt.sign creates the token using the user's data as the payload and a secret key JWT_SECRET
    res.header('Authorization', token).send({ token });
});
     // the header is authorization in here 
    //we use .header in here because we have metadata (data explaining another data) and we don't use .body as that is for main responses and .header is more secure
   //('Authorization', token) in here we add the token to the authorization then with .send we send it back to the user 

   // Create Expense 
app.post('/expenses', authenticateToken, (req, res) => {
    // defines a POST endpoint at /expenses for creating a new expense
    // after authenticatetoken we put comma
// the 'authenticateToken' middleware runs first to ensure the request is from an authenticated user
// if the token is valid the request continues otherwise it's denied
    const { description, amount } = req.body;
    //this gets the description and amount from the user
    const expense = { id: expenses.length + 1, userId: req.user.id, description, amount };
    //in here we make the variable and assign the id to it with the expenses length + 1 (so if it is 10 it will be 11)
    //the first id is for the expense not the user
    // the second one is for the user (the user must be authenticated) 
    //then we extract the description and amount this comes from the user before hand and are assigned to the expense variable 
    expenses.push(expense);
    // in here we add the new expense object to the array of expenses that we declared above
    res.status(201).json(expense);
});
// 201 is for created 
//we say .json because it is a way of transmiting data between the server and the client
// and we send back the expense back to the user to inform them it has been created 


// Get Expenses 
app.get('/expenses', authenticateToken, (req, res) => {
    // same thing in here just keep in mind we say authenticateToken so only authorised users can enter 
    //in here we want to get all the expenses hence we don't have :/id but below we have for getting revenues
    // :/ id if used in this code are used for .get .put .delte as they require specifications
    //this part is the exception
    const userExpenses = expenses.filter(expense => expense.userId === req.user.id);
    // can use e instead of expense as we said before 
    // first u need to know we should use .filter instead of .find because .filter can return multiple matches as we may have multiple expenses 
    // as for .find it only returns the first expense
    //and our filtering condtion is that the userId of the expense must equal  the id of the user(te second id is the one that was authenticated before) 
    res.json(userExpenses);
});
// in here we send the userexpense so the user can read
// the reason we use .json in here instead of .send is because .send would require more steps and we need to manually type out the headers 
//this is how it would be if we used .send res.send(JSON.stringify(userExpenses)); we would have to conver it to a string manually 
//as .json does that for us automatically 


// Update Expense
app.put('/expenses/:id', authenticateToken, (req, res) => {
    // in here we use .put instead of .post 
    //because . put is used when u want to update an existing resource in our case the exxpense and when using put we must identify the specific url in order to specify
    //which resource is being updated
    //.post is more for creating rather than updating 
    const expense = expenses.find(exp => exp.id === parseInt(req.params.id) && exp.userId === req.user.id);
    // we use .find so we can get the first match
    // our condtions for the find is 
    //the expenses id must equal the id from the url(id from url is the req.params.id)
    //we use parseInt to change the id we get rom the url from string to an integer (it is a string by default so we must convert to integer for numerical comaparing)
    //the scond part of the condtion is to ensure that the current expense actually belongs to the user
    if (!expense) return res.status(404).send('Expense not found');
    //retrun 404 means resource not found and we send the message to alert the user


    const { description, amount } = req.body;
    // we do this again because even if these properties are used multiple times across different routes each time it is independent
    expense.description = description;
    // This line updates the description property of the expense object with the new value provided in the description variable.
    // for example if the description of the expense before was books it updates to math books

    expense.amount = amount;
    // same thing here 

    res.json(expense);
});
// same reasons stated before 

// Delete Expense
app.delete('/expenses/:id', authenticateToken, (req, res) => {
    
    expenses = expenses.filter(exp => exp.id !== parseInt(req.params.id) || exp.userId !== req.user.id);
    res.status(204).send();
});
// this route handler deletes an expense by filtering out the expense with the specified id from the expenses array
// it only removes the expense if the id matches and belongs to the currently authenticated user
// the 204 no content status code is for that there is no content to return


// Create Revenue
app.post('/revenues', authenticateToken, (req, res) => {
    const { description, amount } = req.body;
    const revenue = { id: revenues.length + 1, userId: req.user.id, description, amount };
    revenues.push(revenue);
    res.status(201).json(revenue);
});
// Creates a new revenue object with a unique id 
//userId from the authenticated user and other details from the request body.
// Adds the new revenue to the revenues array.
// 201 is for created 


// Get Revenues
app.get('/revenues', authenticateToken, (req, res) => {
    const userRevenues = revenues.filter(revenue => revenue.userId === req.user.id);
    res.json(userRevenues);
});

// Update Revenue
app.put('/revenues/:id', authenticateToken, (req, res) => {
    //again update so we want to use .put 
    const revenue = revenues.find(rev => rev.id === parseInt(req.params.id) && rev.userId === req.user.id);
    if (!revenue) return res.status(404).send('Revenue not found');

    const { description, amount } = req.body;
    //extracting descp and amount 
    revenue.description = description;
    //assigining new values
    revenue.amount = amount;
    //assigning new values

    res.json(revenue);
});

// Delete Revenue
app.delete('/revenues/:id', authenticateToken, (req, res) => {
    revenues = revenues.filter(rev => rev.id !== parseInt(req.params.id) || rev.userId !== req.user.id);
    res.status(204).send();
});

// Get Balance
app.get('/balance', authenticateToken, (req, res) => {
    const userExpenses = expenses.filter(expense => expense.userId === req.user.id);
    const userRevenues = revenues.filter(revenue => revenue.userId === req.user.id);

    const totalExpense = userExpenses.reduce((acc, curr) => acc + curr.amount, 0);
    //. reduce goes through every element of the array 
    //acc is acculmulator 
    //curr is current value
    // keep in mind even if u wanted to subtracate instead of addition you would still type the acc , curr as it is the only thing that would change is acc - curr.amount
    // the 0 is for the initial value of the accumulator if we don't put this the accumulator would just use the first element of the array as a starting value to add
    const totalRevenue = userRevenues.reduce((acc, curr) => acc + curr.amount, 0);
    //same things as above just for revenue this time so we can get the revenues total also
    const balance = totalRevenue - totalExpense;
    res.json({ balance });
    // here is the differnce between adding curly braces and not for oir object in this case
    // with curly braces the output would be "balance": 500
    // without curly braces the output would just be 500
    
});

//starting the server
app.listen(5500, () => console.log(`Server is running on port ${PORT}`));