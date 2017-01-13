var express = require("express");
var mysql = require("mysql");
var cors = require("cors");
var validator = require('validator');
var bodyParser = require('body-parser');

var app = express();
var port = process.env.PORT || 8080;

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

//-------------------Create Invoice---------------------

invoiceRouter.route('/createInvoice')
	.post(function(req,res){
		var invoice = req.body.sendInvoice;
        var InvoiceID = null;
		console.log(invoice.list);
       pool.query("INSERT INTO Invoice (invoice_no,date_of_issue,address,currency,dueDate,UID) VALUES ('"+invoice.invoice_no+"','"+invoice.doi+"','"+invoice.address+"','"+invoice.currency+"','"+invoice.dueDate+"',2) ",function(err,rows) {
          if(err){
            console.log(err);
          }
       });
       pool.query("SELECT InvoiceID from Invoice where invoice_no='"+invoice.invoice_no+"'",function(err,rows){
            if(!err){
                var data = parse(rows);
                InvoiceID = data[0].InvoiceID; console.log(InvoiceID);
                 invoice.list.forEach(function(element) {
                   pool.query("INSERT INTO InvoiceList (invoiceID,item,desc,qty,unitp) VALUES ("+InvoiceID+",'"+element.item+"','"+element.desc+"',"+element.qty+","+element.unitp+")",function(err,rows) {  
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



invoiceRouter.route('/test')
    .get(function(req, res) {

        console.log(res);

        res.send("hi");
    });

app.use('/', invoiceRouter);
app.listen(port, function() {
    console.log("Running @ port " + port);
});