const mysql = require('mysql')

// require('dotenv').config();

const connection = mysql.createConnection({

    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ngo-medicine'

});

connection.connect((err)=>{
    if(err){
        console.log(err)
    }else{
        console.log("Database connected");

    }
})

module.exports= connection