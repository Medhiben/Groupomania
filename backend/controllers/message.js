const jwt = require('jsonwebtoken');
const db = require('../mysqlConnect');//Configuration information de connections mysql
const dotenv = require("dotenv");
dotenv.config({ path: './.env' });
const fs = require('fs'); 



// --  CREATE  -- //

exports.createMessage = (req, res, next) => {
    
};


// --  MODIFY  -- //

exports.modifyMessage = (req, res, next) => {
    
};


// --  DELETE  -- //


exports.deleteMessage = (req, res, next) => {

   
};

//récupérer tous les messages
exports.getAllMessages = (req, res, next) => {
    
}; 