const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const validator = require('validator');
const bodyParser = require('body-parser');

var sesson = require('express-session');
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
var invoiceRouter = express.Router();


// app.use(session(sess));



//function to validate if username/pass is null or too long
function valid(Uname, pass) {

    if (Uname.length === 0 || Uname.length > 20 || pass.length === 0 || pass.length > 32) {
        return false;
    }
    return true;
}

function parse(rows) {

    var data = JSON.stringify(rows);
    data = JSON.parse(data);
    return data;
}


//-----------------Login--------------------


invoiceRouter.route("/login")
    .post(function(req, res) {
        var Uname = req.body.userName;
        var pass = req.body.password;
        var result = {
            "status": "",
            "message": "",
            "type": null
        };

        if (valid(Uname, pass)) {

            pool.query("SELECT password,RoleID from user where UserID ='" + Uname + "'", function(err, rows)

                {                
                    if (!err) {
                        if (rows.length > 0) {
                            console.log(rows);


                            var data = parse(rows);

                            if (pass == data[0].password) {
                                result.status = 200;
                                result.message = "Success";
                                pool.query("SELECT RoleType from Role where RoleID ='" + data[0].RoleID + "'", function(err, rows) {
                                    var data = parse(rows);
                                    console.log(typeof data[0].RoleType);
                                    result.type = data[0].RoleType;
                                    result = JSON.stringify(result);
                                    res.send(result);
                                });
                            } else {
                                console.log("wrong pass");
                                result.status = 403;
                                result.message = "Invalid Password";
                                res.send(result);

                            }
                        } else {
                            console.log("wrong Uname");
                            result.status = 403;
                            result.message = "Invalid UserID";
                            res.send(result);
                        }
                    }

                });

        } else {
            console.log("pass too long");
        }

    });


invoiceRouter.route('/createInvoice')

    //-------------------username generation--------------
    .get(function(req,res){
        pool.query("SELECT UID,UserID from user where RoleID = 2 ",function (err,rows) {
           if(err){
            console.log(err);
           }
            res.send(rows);
    });

    })


//-------------------Create Invoice---------------------
	.post(function(req,res){
		var invoice = req.body.sendInvoice;
        var InvoiceID = null;
		console.log(invoice.invoice_no);
       pool.query("INSERT INTO Invoice (invoice_no,date_of_issue,address,currency,dueDate,UID) VALUES ('"+invoice.invoice_no+"','"+invoice.doi+"','"+invoice.address+"','"+invoice.currency+"','"+invoice.dueDate+"',"+invoice.cname+") ",function(err,rows) {
          if(err){
            console.log(err);
          }
       });
       pool.query("SELECT InvoiceID from Invoice where invoice_no=?",[invoice.invoice_no],function(err,rows){
            if(!err){
                var data = parse(rows);
                InvoiceID = data[0].InvoiceID; console.log(InvoiceID);
    
                invoice.list.forEach(function(element) {
                var list={invoiceID : InvoiceID, item : element.item, desc : element.desc, qty : element.qty , unitp : element.unitp};
                   pool.query("INSERT INTO InvoiceList SET ?",list,function(err,rows) {  
                    if(err){
                             console.log(err);
                    }
                   });
            })
             }
       })
       console.log(InvoiceID);
	   res.end();
	})

invoiceRouter.route('/viewInvoiceAdmin')
    .get(function(req,res){
        var invoice = null;
        var data;
        var flag=0;
         pool.query("SELECT * from Invoice where CreatedBy = 1",function(err,rows){
            if(err){
                throw err;
            }
            invoice = parse(rows);

            invoice.forEach(function(element){
                element.list = [];
                pool.query("SELECT * FROM InvoiceList where invoiceID=?",[element.InvoiceID],function(err,rows){
                    data = parse(rows); 
                    element.list.push(data);
                    console.log(element);
              
                  
                    
                });
              

            });
          
            res.send(invoice); 
       

         });

        

    })

invoiceRouter.route('/test')
    .get(function(req, res) {

        console.log(res);

        res.send("hi");
    });

app.use('/', invoiceRouter);
app.listen(port, function() {
    console.log("Running @ port " + port);
});