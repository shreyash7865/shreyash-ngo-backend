const mysql = require('mysql')

require('dotenv').config();

const connection = mysql.createConnection({

    host: process.env.host,
    user: process.env.user,
    password: '',
    database: process.env.database,

});

connection.connect((err)=>{
    if(err){
        console.log(err)
    }else{
        console.log("Database connected");

    }
})

module.exports= connection