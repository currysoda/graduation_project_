const mysql = require(`mysql2/promise`);
const bluebird = require(`bluebird`);
const path = require(`path`);
// require(`dotenv`).config;

module.exports = async () => {
    const connection = await mysql.createConnection({
        host: `localhost`,
        user: `root`,
        password: `a1b2c3d4`,
        database: `personnel_management`,
        multipleStatements: false
        , Promise: bluebird
    });

    // connection.connect();

    return connection;
}