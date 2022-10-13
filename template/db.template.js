const mysql = require(`mysql`);

const db = mysql.createConnection({
    host : ``,
    user : ``,
    password : ``,
    database : ``
    
})

db.connect();

module.exports = db;