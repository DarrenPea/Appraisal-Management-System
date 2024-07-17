const mysql = require('mysql2');

//create connection to local mysql database
let pool = mysql
  .createPool({
    host: "localhost",
    user: "scadet",
    database: "nodelogin",
    password: "pw123",
    connectionLimit: 10,
  }).promise();

async function cleanup() {
    await pool.end();
}

module.exports = {pool, cleanup};