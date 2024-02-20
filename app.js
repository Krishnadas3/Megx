const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const userRouter = require('./routes/userRoute');
const adminRouter = require('./routes/adminRoute')

const app = express(); // Define the Express app here

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static('public'));

const { parsed: config } = require('dotenv').config();
global.config = config;

mongoose.connect(config.CONNECTION_STRING, {
    dbName: 'shop'
})
    .then((data) => {
        console.log("DB Connected");
    })
    .catch((err) => {
        console.log(err);
    });

app.use('/', userRouter);
app.use('/admin',adminRouter)

app.listen(5050, () => {
    console.log('Server is running on port 5050');
});
