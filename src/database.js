const mysql = require('promise-mysql'); 
require('dotenv').config(); 
const { HOST, USER, PASSWORD, DATABASE } = process.env; 

const connection = mysql.createConnection({
    host: HOST,
    user: USER, 
    password: PASSWORD, 
    database: DATABASE,
});

function getConnection(){
    return connection; 
}; 

module.exports = { getConnection }; 