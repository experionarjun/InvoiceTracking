const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const validator = require('validator');
const bodyParser = require('body-parser');

var sesson = require('express-session');
var jwt = require('jsonwebtoken');
var path = require('path');
var login = require('./login.js');
var createInvoice = require('./createInvoice.js');
var auth = require('./auth.js');
var parse = require('./parse.js');
var app = express();
var mail = require('./Mail.js');
var port = process.env.PORT || 8080;

// app.use(express.static(path.join(__dirname,"..","style")));
// app.use("/reset",express.static(path.join(__dirname,"..","script")));
// app.use(express.static(path.join(__dirname,"..")));
app.set("views",path.join(__dirname,".."));
// app.set("reset",path.join(__dirname,".."));
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
app.engine('html',function(){});

var loginRouter = express.Router();
var authRouter = require('./authRouter.js')
var adminRouter = express.Router();
var userRouter = express.Router();



//-----------------Login--------------------

loginRouter.route("/login")
    .get(function(req, res) {
        var Uname = req.headers.username;
        var pass = req.headers.password;
        console.log(Uname,pass);
        login(Uname, pass, res);
    })
    .post(function(req,res){
        var email = req.body.email;
        mail.forgotPassword(email,res);
        
    })

loginRouter.route("/reset/:token")
// -----------reset password-------------
.post(function(req,res){
    var newPass = req.body.newPassword;
    var token = req.params.token;
    var decoded = jwt.verify(token,'l00p', function(err,decoded){
        if(err){
            res.send("Link Expired!");
        }else{
            pool.query("UPDATE user SET password = ? WHERE UID = ?",[newPass,decoded.UID],function(err,rows){
                if(err){
                    res.send("ERROR!");
                }else{
                    res.send("Successfully Updated!");
                }
            })
        }
    })
    

})    

//--------------Authenticate User-------------    
loginRouter.route("/auth")
    .post(function(req, res) {
        var UID = req.body.UID;
        var Role = req.body.Role;
        var token = req.body.token;
        auth(UID, Role, token)
            .then(function(js) {

                res.send(js);

            })
            .catch(function(js) {

                res.send(js);
            });

    });
// -------------------TEST------------------
loginRouter.route('/test')
    .get(function(req, res) {
        // mail.newInvoice(60);
       res.send("hi");
    });



authRouter.route('/customer')
    //-------------------username generation--------------
    .get(function(req, res) {
        pool.query("SELECT UID,UserID from user where RoleID = 2 ", function(err, rows) {
            if (err) {
                console.log(err);
            }
            res.send(rows);
        });
    });
authRouter.route('/customer/:UID')
//...............send address of customer.............
.get(function(req,res){
    var UID = req.params.UID;
    pool.query("SELECT address,city,state,zip,country FROM user WHERE UID = '"+UID+"'",function(err,rows){
        if(!err){
        var result = parse(rows);
        res.send(rows);
        }else{ 
            throw err;
        }
    
    })
})




adminRouter.route('/Invoice')
    //-------------------Create Invoice---------------------
    .post(function(req, res) {
        var invoice = req.body.sendInvoice;
        var Admin = JSON.parse(req.headers.authorization);
        createInvoice(invoice ,Admin.UID ,res);
    })
    //-------------------Display Invoice List---------------    
    .get(function(req, res) {
        var invoice = null;
        var Admin = JSON.parse(req.headers.authorization); 
        pool.query("SELECT a.InvoiceID,a.date_of_issue,a.currency,a.status,a.total,b.UserID FROM Invoice a, user b where CreatedBy = "+Admin.UID+" and a.UID = b.UID ORDER BY a.date_of_issue DESC", function(err, rows) {
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
        pool.query("SELECT a.InvoiceID, a.invoice_no, a.date_of_issue, a.address, a.currency, a.dueDate,a.status, a.total, b.item, b.desc, b.qty, b.unitp, c.UserID FROM Invoice a, InvoiceList b, user c WHERE a.InvoiceID =" + invID + " AND a.InvoiceID = b.invoiceID AND a.UID = c.UID", function(err, rows) {
            if (!err) {
                console.log(rows);
                res.send(rows);
            }
        })

    })
    .put(function(req,res){
        var changedInvoice = req.params.invID;
        var newStatus = req.body.newStatus;
        pool.query("UPDATE Invoice SET status =? WHERE InvoiceID=? ",[newStatus , changedInvoice], function(err,rows) {
            if(err){
                throw err;
                res.send("unable to update")
            }else{
                console.log("updated")
                res.send("updated");
            }
        })
    })

userRouter.route('/Invoice')
//-------------------display invoice for user-----------------
    .get(function(req, res) {
        var invoice = null;
        var user = JSON.parse(req.headers.authorization); 
        pool.query("SELECT a.InvoiceID,a.invoice_no,a.date_of_issue,a.currency,a.total,a.status,a.dueDate FROM Invoice a where UID = "+user.UID+" ORDER BY a.InvoiceID DESC", function(err, rows) {
            if (err) {
                throw err;
            }
            invoice = parse(rows);
            res.send(invoice);
        });
    });

// console.log("p", path.join(__dirname,".."));
app.use('/', loginRouter);
app.use('/auth', authRouter);
app.use('/auth', adminRouter);
app.use('/auth/user', userRouter);
app.listen(port, function() {
    console.log("Running @ port " + port);
});