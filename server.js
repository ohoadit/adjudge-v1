require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');

const loginRoute = require('./Routes/serverLogin');
const dashboardRoute = require('./Routes/serverDashboard');
const signupRoute = require('./Routes/serverSignup');

const app = express();

app.use(morgan('dev'))
   .use(cors())
   .use(bodyParser.urlencoded({ extended : false}))
   .use(bodyParser.json())
   .use(favicon(path.join(__dirname,'client','public','favicon.ico')));

app.use('/login',loginRoute)
   .use('/dashboard',dashboardRoute)
   .use('/signup',signupRoute);

const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, 'client/build')))
   .listen(PORT);

app.get('/*',(req, res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'));
});