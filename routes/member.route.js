const router = require('express').Router();
const mysql = require('mysql');
const connection = require('../db/conn');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { Configuration, OpenAIApi } = require('openai');
const configuration = new Configuration({
    apiKey: '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',

})
const openai = new OpenAIApi(configuration);



const session = require('express-session');
router.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

router.post('/signup', (req, res) => {
    const f_name = req.body.f_name;
    const l_name = req.body.l_name;
    const email = req.body.email;
    const password = req.body.password;
    const address = req.body.address;


    connection.query(`create table if not exists member(f_name varchar(255), l_name varchar(255), email varchar(255), password varchar(255), address varchar(255))`, (err, result) => {
        if (err) {
            res.send(err);
        }
        else {
            console.log("Table Created");
            connection.query(`insert into member values(?,?,?,?,?);`, [f_name, l_name, email, password, address],
                (err, result) => {
                    if (err) {
                        res.send(err)
                    }
                    else {
                        res.send(result);
                    }
                })
        }
    });



})

router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    if (email && password) {
        connection.query(`select * from member where email=? and password = ?`,
            [email, password], (err, result) => {
                if (err) {
                    res.send({ message: "Invalid Credentials", result: err });
                }
                if (result.length > 0) {
                    res.status(200).send({ message: "Logged In", result: result[0] })
                    console.log("Member Logged In")
                }
                else {
                    res.send("Invalid Credentials")
                }
            })
    }
})

router.post('/add-medicine', (req, res) => {
    const id = req.body.id;
    const nameOfMedicine = req.body.nameOfMedicine;
    const Quantity = req.body.Quantity;
    const ExpiryDate = req.body.ExpiryDate;
    const donorName = req.body.donorName;
    if (req.session) {
        connection.query(`create table if not exists medicine(id varchar(255), nameOfMedicine varchar(255), Quantity varchar(255), ExpiryDate varchar(255), donorName varchar(255))`, (err, result) => {
            if (err) {
                res.send(err);
            }
            else {
                console.log("Table Created");
                connection.query(`insert into medicine values(?,?,?,?,?);`, [id, nameOfMedicine, Quantity, ExpiryDate, donorName]
                    , (err, result) => {
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
        res.send("User Logged Out")
    }
})

router.post('/chatbot', (req, res) => {
    const { prompt } = req.body;
    const completion = openai.createCompletion({
        model: 'davinci-codex',
        prompt: prompt,
        maxTokens: 512,
        temperature: 0,
    })

    res.send(completion.data.choices[0].text)
});




module.exports = router;