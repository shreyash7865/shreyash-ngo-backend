const router = require('express').Router();
const mysql = require('mysql');
const connection = require('../db/conn');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const session = require('express-session');
router.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 60000*60*24,
    }

}))

router.post('/signup', (req, res)=>{
    const username = req.body.username;
    const regdNumber = req.body.regdNumber;
    const password = req.body.password

    connection.query(`insert into admin values(?,?,?)`, [username, regdNumber, password]
    , (err, result)=>{
        if(err){
            res.send(err);
        }else{
            res.send(result);
        }
    })
})

// Admin Login

router.post('/login', (req, res) => {
    const regdNumber = req.body.regdNumber;
    const password = req.body.password;
  
    connection.query(
      'SELECT * FROM admin WHERE regdNumber = ? AND password = ?',
      [regdNumber, password],
      (err, results) => {
        if (err) {
          res.send(err);
        } else {
          if (results.length > 0) {
            // Login successful
            res.send(results[0]);
          } else {
            // Invalid credentials
            res.send('Invalid credentials');
          }
        }
      }
    );
  });


// View Medicines
router.get('/medicines', (req, res)=>{
    if(req.session){
        connection.query(`select * from medicine`, (err, result)=>{
            if(err){
                res.send(err);
            }
            else{
                res.send(result);
            }
        })
    }
    else{
        res.send(req.session);
    }
})

// Delete Medicines
router.delete('/medicines/:id', (req, res)=>{
    const id = req.params.id;
    if (req.session){
        connection.query(`delete from medicine where id=?`,[id],
        (err,result)=>{
            if(err){
                res.send(err)
            }else{
                res.send(result);
            }
        })
    }
    else{
        res.send("Admin Logged Out");
    }
})

router.get('/requested-medicine', (req, res)=>{
    if(req.session){
        connection.query(`select * from requestedmedicine`, (err, result)=>{
            if(err){
                res.send(err);
            }
            else{
                res.send(result);
            }
        })
    }
})
router.get('/members', (req, res) => {
    connection.query('SELECT * FROM member', (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
  });


router.get('/home',(req, res)=>{
    if(req.session.loggedin){
        res.send("Home")
    }
    else{
        res.send("User Logged out")
    }
})

router.get('/logout', (req, res)=>{
    req.session.loggedin = false;
    res.send(req.session)
})


module.exports = router;