const router = require('express').Router();
const mysql = require('mysql');
const connection = require('../db/conn');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const session = require('express-session');
router.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));



router.post('/add-ngo', (req, res) => {
    const name = req.body.name;
    const username = req.body.username;
    const password = req.body.password;
    const address = req.body.address;


    connection.query(`insert into ngo values (?,?,?,?);`,
        [name, username, password, address], (err, result) => {
            if (err) {
                res.send(err);
            }
            else {
                res.send(result);
            }
        });
});

router.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        connection.query(`select * from ngo where username=? and password =?`
            , [username, password], (err, result) => {
                if (err) {
                    res.send("Invalid Credentials");
                }
                if (result) {
                    res.status(200).send(result[0])
                }
                else {
                    res.send("Invalid Credentials")
                }
            })
    }
    else {
        res.send("Invalid Credentials")
    }
})

router.post('/request-medicine', (req, res) => {
    const ngoname = req.body.ngoname;
    const medName = req.body.medicineName;
    const medQty = req.body.medicineQty;


    if (req.session) {
        connection.query(`create table if not exists requestedmedicine(ngoname varchar(255), medicineName varchar(255), medicineQty int);`, (err, result) => {
            if (err) {
                res.send(err);
            }
            else {
                console.log("Table Created");
                connection.query(`insert into requestedmedicine values((select username from ngo where username =? ),?,?);
        `, [ngoname, medName, medQty], (err, result) => {
                    if (err) {
                        res.send(err);
                    }
                    else {
                        res.send(result);
                    }
                })
            }
        })

    }
    else {
        res.send("You Logged Out");
    }
})





module.exports = router;