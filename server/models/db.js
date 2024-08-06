const mysql = require('mysql2');

//create connection to local mysql database
let pool = mysql
  .createPool({
    host: "localhost",
    user: "q0q", // write username here
    database: "esc_proj",
    password: "q0q27", // write password here
    connectionLimit: 10,
  }).promise();

async function cleanup() {
    await pool.end();
}

module.exports = {pool, cleanup};