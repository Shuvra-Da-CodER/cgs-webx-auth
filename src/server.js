const http= require('http');
const app= require('./app');
const express=require('express');
app.use(express.json());
require('dotenv').config();
app.use(express.urlencoded({extended:true}));

const server= http.createServer(app);

const PORT= process.env.PORT || 3000; // Default to 3000 if PORT is not set in .env

server.listen(PORT, () => { 
    console.log(`Server is running on port ${PORT}`);
});