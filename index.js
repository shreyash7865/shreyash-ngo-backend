const express = require('express')
const cors = require('cors')
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));


const adminRoute = require('./routes/admin.route');
const donorRoute= require('./routes/member.route');
const ngoRoute = require('./routes/ngo.route');

app.use('/api/admin', adminRoute);
app.use('/api/donor', donorRoute );
app.use('/api/ngo', ngoRoute);


require('./db/conn');

app.listen(2020, ()=>{
    console.log(`http://localhost:2020`)
})