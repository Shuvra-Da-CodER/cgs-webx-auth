const express=require('express');
const cors=require('cors');
const dotenv = require('dotenv');
dotenv.config();
app=express();
app.use(express.json());
app.use(cors());
const cookieParser=require('cookie-parser');
app.use(cookieParser());
const connectDB = require('./db');
connectDB();
const {body}= require('express-validator');
const userController=require('./user.controller')
const auth=require ('./auth.middleware')

app.get('/',(req,res)=>{
    res.send('WEB-X TASK FOR CGS');
})
app.post('/signup',[
    body('username').isLength({min: 6}).withMessage('Username must be at least 6 characters long'),
    body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters long'),
    body('description').isLength({min: 6}).withMessage('description must be at least 6 characters long'),
    userController.registerUser
])

app.get('/signin',[
    body('username').isLength({min: 6}).withMessage('Username must be at least 6 characters long'),
    body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters long'),

    userController.loginUser
])

app.get('/me',auth.authUser,userController.getProfile);

app.put('/me', auth.authUser, userController.updateProfile);

module.exports=app;