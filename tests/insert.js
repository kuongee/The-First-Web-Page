var connection = require('../config/db');
connection.connect(); 

//anonymous function
// ` 이걸 사용하면 \ 쓰지 않고 여러 줄을 쓸 수 있음
connection.query(`insert into user (id, userid, passwd, nickname)
values (null, ?, password(?), ?)`, ['3abcd', '123123', ''],
function (error, results, fields) {
  if (error) throw error;
  console.log('The result is: ', results);
});

connection.end();