const mysql = require('mysql');
const {db}  = require('./keys');
const { promisify } = require('util');


console.log('tryin connection');

//console.log(db);
const pool = mysql.createPool(db);

pool.getConnection(function(err, connection) {
    if (err) throw err; // not connected!
  
    // Use the connection
    connection.query('SELECT * FROM users', function (error, results, fields) {
      // When done with the connection, release it.
      connection.release();
  
      // Handle error after the release.
      if (error) throw error;
      if(connection) console.log('connect timeout: '+connection.config.connectTimeout+' / idthread : '+connection.threadId)
      
      // Don't use the connection here, it has been returned to the pool.
    });
  });


  //promisify pool query añade promesas
pool.query = promisify(pool.query);

module.exports =  pool;

