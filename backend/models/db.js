const mysql = require("mysql");
require("dotenv").config(); // Load environment variables

const con = mysql.createConnection({
    user: process.env.USER,
    host: "localhost",
    password: process.env.PASSWORD || "", // Use an empty string if PASSWORD is undefined
    database: process.env.DATABASE
});

con.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

module.exports = con;
