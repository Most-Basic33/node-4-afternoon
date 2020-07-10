require('dotenv').config();
// Create a variable called app and set it equal to express invoked.
const express = require('express');
const session = require('express-session');
const app = express();
const checkForSession = require('./middlewares/checkForSession')
// Destructure SERVER_PORT and SESSION_SECRET from process.env.
let {SERVER_PORT, SESSION_SECRET} = process.env;
//require the auth controller in server/index.js and create endpoints to hit every method on the controller.
const authCotroller = require('./controllers/authController');
const swagController = require('./controllers/swagController');
const cartController = require('./controllers/cartController');
//Middleware
app.use(express.json());
// Let's add express.json so we can read JSON from the request body and add session so we can create sessions. Remember that session needs a configuration object as the first argument. The object should have a secret, resave, and saveUninitialized property. secret can be any string you like that is stored in your .env file and resave and saveUninitialized should equal true.
app.use(
session({
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: true
})
);
app.use(checkForSession)

//Auth Controller
app.post('/api/login', authCotroller.login)
app.post('/api/register', authCotroller.register)
app.post('/api/signout', authCotroller.signout)
app.get('/api/user', authCotroller.getUser)
//Swag Controller
app.get('/api/swag', swagController.read)
//NOTE: It is very important that this endpoint come first.
app.post('/api/cart/checkout', cartController.checkout)
app.post('/api/cart/:id', cartController.add)
app.delete('/api/cart/:id', cartController.delete)

app.listen(SERVER_PORT, () =>{
    console.log(`Server listening on port ${SERVER_PORT}`)
})