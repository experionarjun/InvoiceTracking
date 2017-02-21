const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

var app = express();
app.use(cors());

var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'l00p',
    database: 'person'
});
var mail = require('./Mail.js');
var parse = require('./parse.js');
var InvoiceID = null;

module.exports = function(invoice, AdminID, res) {

    console.log("invoice", invoice);
    console.log("AdminID", AdminID);
    var js = { status:404, message:" <strong>ERROR!</strong>   Invalid Fields!"};
    if (valid(invoice)) {
        address = invoice.address.line+','+invoice.address.city+','+invoice.address.state+','+invoice.address.country+',Zip code: '+invoice.address.zip;
        pool.query("INSERT INTO Invoice (invoice_no,date_of_issue,address,currency,dueDate,total,UID,CreatedBy) VALUES ('" + invoice.invoice_no + "','" + invoice.doi + "','" + address + "','" + invoice.currency + "','" + invoice.dueDate + "'," + invoice.total + "," + invoice.cname + "," + AdminID + ") ", function(err, rows) {
            if (err) {
                console.log(err);
            }

            console.log("query1");


            pool.query("SELECT InvoiceID from Invoice where invoice_no=?", [invoice.invoice_no], function(err, rows) {
                if (!err) {
                    var data = parse(rows);
                    InvoiceID = data[0].InvoiceID;
                    console.log(rows);

                    invoice.list.forEach(function(element) {
                        var list = {
                            invoiceID: InvoiceID,
                            item: element.item,
                            desc: element.desc,
                            qty: element.qty,
                            unitp: element.unitp
                        };
                        pool.query("INSERT INTO InvoiceList SET ?", list, function(err, rows) {
                            if (err) {
                                console.log(err);
                            } 
                            console.log("createInvoice",InvoiceID);
                            mail.newInvoice(InvoiceID);
                        });
                    })
                } else {
                    pool.query("DELETE FROM Invoice WHERE  InvoiceID =" + data[0].InvoiceID, function(err, rows) {
                        if (err) {
                            throw err;
                        }
                    })
                    console.log(err);
                }
            })
            js.status = 200;
            js.message = "success";
            
            
            res.send(js);
        })
    } else {
        res.send(js);
    }
}


function valid (invoice) {
    cflag = true;
    if (invoice.invoice_no === "") {
        cflag = false;
    } else if (invoice.doi === "" || invoice.doi == "Invalid Date") {
        cflag = false;
    } else if (invoice.dueDate === "" || invoice.dueDate == "Invalid Date" || invoice.doi > invoice.dueDate) {
        cflag = false;
    } else if (invoice.cname === "") {
        cflag = false;
    } else if (invoice.address === "") {
        cflag = false;
    } else if (invoice.currency === "") {
        cflag = false;
    }

    return cflag;
};