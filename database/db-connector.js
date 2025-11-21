/*
 * Database Connection Module
 * CS340 Group 73 - Rehjii Martin & Jonah Sutch
 */

// Load environment variables from .env file
require('dotenv').config();

// Get an instance of mysql we can use in the app
let mysql = require('mysql2')

// Create a 'connection pool' using environment variables
const pool = mysql.createPool({
    waitForConnections: true,
    connectionLimit   : 10,
    host              : process.env.DB_HOST,
    user              : process.env.DB_USER,
    password          : process.env.DB_PASSWORD,
    database          : process.env.DB_NAME
});

// Export it for use in our application
module.exports = {
    pool: pool
};
