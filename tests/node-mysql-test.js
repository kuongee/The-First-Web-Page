var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'devuser',
  password : 'devpass',
  port : 3307,
  database : 'devdb'
}); // json

connection.connect(); 

//anonymous function
connection.query('SELECT * from user', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].userid);
});

connection.end();