const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const path = require('path');


require('dotenv').config();

const port = 3000;

const clientInfo = {
    username: process.env.MONGO_DB_USERNAME,
    password: process.env.MONGO_DB_PASSWORD
};

const url = `mongodb+srv://${clientInfo.username}:${clientInfo.password}@cluster0.yxbxx1g.mongodb.net/User?retryWrites=true&w=majority`;

const app = express();
app.use(express.urlencoded({ extended:true }));

app.use(cookieParser());
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

process.on('uncaughtException', (error) => {
    console.error(`Uncaught Exception:${error.message}`);
    process.exit();
});

process.on('unhandledRejection', (error) => {
    console.error(`Unhandled Rejection:${error.message}`);
    process.exit();
});

mongoose.connect(url).then(() => {
    app.listen(port, () => console.log(`Express is listening to port ${port}`));
}).catch(() => console.log('Error in connecting to mongodb atlas'));
