const mysql = require('promise-mysql'); 

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: 'guineaplan', 
    database: 'bodega1',
});

function getConnection(){
    return connection; 
}; 

module.exports = { getConnection }; 