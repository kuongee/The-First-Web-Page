var connection = require('../config/db');

connection.connect(); 

//anonymous function
connection.query('SELECT path from image', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results);
});

connection.end();