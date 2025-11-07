/*
 * Database Connection Module
 * CS340 Group 73 - Rehjii Martin & Jonah Sutch
 */

// Get an instance of mysql we can use in the app
let mysql = require('mysql2')

// Create a 'connection pool' using the provided credentials
const pool = mysql.createPool({
    waitForConnections: true,
    connectionLimit   : 10,
    queueLimit: 1000,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
}); 

// Export it for use in our application
module.exports = {
    pool: pool
};
