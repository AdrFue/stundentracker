let mysql = require('mysql2')
require('dotenv').config()

let con = mysql.createConnection({
  host     : process.env.HOST,
  port     : process.env.PORT,
  user     : process.env.USER,
  password : process.env.PASSWORD,
  database : process.env.DATABASE
});
 

function qry(qry) {
  return new Promise((resolve, reject) => {
    con.query(qry, function(error, results) {
      if (error) {
        return reject(error);
      }
      resolve(results);
    });
  });
};

module.exports = {
  qry
};