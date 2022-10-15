//codigo para conectar con basa de datos

const mysql=require('mysql')


var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'cortocircuito'
  });


  connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
   
    console.log('connected as id ' + connection.threadId);
  });

  //connection.end()
  module.exports= connection
   