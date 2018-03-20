var mysql      = require('mysql');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'devuser',
    password : 'devpass',
    port : 3307,
    database : 'devdb'
  }); 

  module.exports = connection;

  /* 공통된 코드를 한 곳으로 빼서 만듬 */