var mysql = require('mysql');



export default class Connection{
    constructor(host,user,pass,port,db){
        
        this.host = host;
        this.user = user;
        this.pass = pass;
        this.port = port;
        this.db = db;    
    }
        connection(){

            var connection = mysql.createConnection({
                host: "localhost",
                user: `${this.user}`,//"EdAdmin",
                password: `${this.pass}`,//"123456", 
                port: `${this.port}`,//,8889
                database:  `${this.db}`,//"UsersT"
            })

                connection.connect(function(err) {
                    // in case of error
                    if(err){
                        console.error('error connecting: ' + err.stack);
                        console.log(err.code);
                        console.log(err.fatal);
                    }else{

                        console.log('connected as id ' + connection.threadId);
                    }
                });

                // Perform a query
                let $query = 'SELECT * from users LIMIT 10';

                connection.query($query, function(err, rows, fields) {
                    if(err){
                        console.log("An error ocurred performing the query.");
                        return;
                    }

                    console.log("Query succesfully executed: ", rows);

                });

                // Close the connection
                connection.end(function(){
                    // The connection has been closed
                });


            return connection

        }
    
}

module.exports.Connection;



//let px = new Connection('localhost','EdAdmin','123456',8889,'UsersT');
//px.connection();