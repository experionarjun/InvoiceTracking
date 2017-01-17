const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const validator = require('validator');
const bodyParser = require('body-parser');

var sesson = require('express-session');
var login = require('./login.js');
var createInvoice = require('./createInvoice.js');
var app = express();
var port = process.env.PORT || 8080;



// var sess = {

//      secret : "l00p"
//      saveUninitialized: true,

//      cookie: { secure: true }
// }

app.use(cors());

var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'l00p',
    database: 'person'
});

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
var loginRouter = express.Router();
var invoiceRouter = express.Router();
var adminRouter = express.Router();
var userRouter = express.Router();

// app.use(session(sess));



function parse(rows) {

    var data = JSON.stringify(rows);
    data = JSON.parse(data);
    return data;
}


//-----------------Login--------------------

loginRouter.route("/login")
    .post(function(req, res) {
        var Uname = req.body.userName;
        var pass = req.body.password;
        login.login(Uname, pass, res);
    });





invoiceRouter.route('/customers')
    //-------------------username generation--------------
    .get(function(req, res) {
        pool.query("SELECT UID,UserID from user where RoleID = 2 ", function(err, rows) {
            if (err) {
                console.log(err);
            }
            res.send(rows);
        });

    })
invoiceRouter.route('/test')
    .get(function(req, res) {
        res.send("hi");
    });


adminRouter.route('/Invoice')
    //-------------------Create Invoice---------------------
    .post(function(req, res) {
        var invoice = req.body.sendInvoice;
        createInvoice.createInvoice(invoice, res);
    })
    //-------------------Display Invoice List---------------    
    .get(function(req, res) {
        var invoice = null;
        pool.query("SELECT a.InvoiceID,a.date_of_issue,a.currency,a.total,b.UserID FROM Invoice a, user b where CreatedBy = 1 and a.UID = b.UID", function(err, rows) {
            if (err) {
                throw err;
            }
            invoice = parse(rows);
            res.send(invoice);
        });
    });

adminRouter.route('/Invoice/:invID')
    //-------------------Display Invoice---------------   
    .get(function(req, res) {
        var invID = req.params.invID;
        pool.query("SELECT a.InvoiceID, a.invoice_no, a.date_of_issue, a.address, a.currency, a.dueDate, a.total, b.item, b.desc, b.qty, b.unitp, c.UserID FROM Invoice a, InvoiceList b, user c WHERE a.InvoiceID =" + invID + " AND a.InvoiceID = b.invoiceID AND a.UID = c.UID", function(err, rows) {
            if (!err) {
                res.send(rows);
            }
        })

    })





app.use('/', invoiceRouter);
app.use('/', loginRouter);
app.use('/', adminRouter);
app.use('/',userRouter);
app.listen(port, function() {
    console.log("Running @ port " + port);
});