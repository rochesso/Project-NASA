const express = require('express');

const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const helmet = require('helmet');

//import routes api
const api = require('./routes/api');

// Configurations
const corsOptions = {
  origin: ['http://localhost:3000'],
};

const app = express();

// Middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(morgan('combined'));
app.use(express.json());

// React app build
app.use(express.static(path.join(__dirname, '../public')));

// Routes
// api version 1.0
app.use('/v1', api);

// React app
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

module.exports = app;
