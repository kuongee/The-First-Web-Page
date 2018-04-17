const { postgres } = require('pg');

var connection = new postgres({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});


  module.exports = connection;