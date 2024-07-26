const mysql = require('mysql2');

//create connection to local mysql database
let pool = mysql
  .createPool({
    host: "localhost",
    user: "root", // write username here
    database: "esc_proj",
    password: "Pea@221201", // write password here
    connectionLimit: 10,
  }).promise();

async function cleanup() {
    await pool.end();
}

module.exports = {pool, cleanup};