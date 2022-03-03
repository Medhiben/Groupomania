const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');


// DEVELOPEMENT: Pour empêcher toutes falsifications au niveau des cookies
const Cookies = require('cookies');


const app = express();

// Headers CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
  // Conversion en JSON
  app.use(express.json());

  // Gestion des images
app.use('/images', express.static(path.join(__dirname, 'images')));

// Limitation des requêtes et Lancement et config rateLimit
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // Pour 15 min
    max: 100 // limite de 100 requests 
  });
  
  app.use(limiter);


// Lancement helmet
app.use(helmet());
app.use(helmet.frameguard({ action: 'deny' })); //Pour interdire d'inclure cette page dans une iframe*/

const accessLogServer = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogServer }));

// Routes



module.exports = app;