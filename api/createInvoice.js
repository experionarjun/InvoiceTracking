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
var parse = require('./parse.js');
var InvoiceID = null;

module.exports.createInvoice = function (invoice,res) {

	pool.query("INSERT INTO Invoice (invoice_no,date_of_issue,address,currency,dueDate,total,UID) VALUES ('"+invoice.invoice_no+"','"+invoice.doi+"','"+invoice.address+"','"+invoice.currency+"','"+invoice.dueDate+"',"+invoice.total+","+invoice.cname+") ",function(err,rows) {
          if(err){
            console.log(err);
          }

          console.log("query1");
         
    
       pool.query("SELECT InvoiceID from Invoice where invoice_no=?",[invoice.invoice_no],function(err,rows){
            if(!err){
                var data = parse.parse(rows);
                InvoiceID = data[0].InvoiceID; console.log(rows);
    
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
	   res.end();
	})
}