const express = require("express");
const cors = require("cors");
const mysql = require("mysql");

var app = express();
var nodemailer = require('nodemailer');
var jwt = require('jsonwebtoken');
var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'l00p',
    database: 'person'
});

var transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                    user: 'invoiceTracker003@gmail.com', // Your email id
                    pass: 'l00p12345' // Your password
                 }
});
var parse = require('./parse.js');

app.use(cors());

var UserID, invoice_no, doi , dueDate;

module.exports.newInvoice = function(InvoiceID) {

    return new Promise(function(resolve,reject){
        console.log("mail",InvoiceID);
    pool.query("SELECT UserID,email,invoice_no, date_of_issue,dueDate FROM Invoice,user WHERE InvoiceID = "+InvoiceID+" AND user.UID = Invoice.UID",function (err,rows) {
        if(err){
            throw err;
        }
        else{

            var data = parse(rows);
            console.log(data);
            UserID = data[0].UserID;
            invoice_no = data[0].invoice_no;
            doi = data[0].date_of_issue.substring(0, 10).split('-').reverse().join('-');
            dueDate = data[0].dueDate.substring(0, 10).split('-').reverse().join('-');
            var to=data[0].email;
            var text = 'Hi '+UserID+',<br><br>This is to inform you that your Order #'+invoice_no+' has been issued on '+doi+'.<br><br>Your due date is on '+dueDate+'.' ;
            var mailOptions = {
                     from: 'invoiceTracker003@gmail.com', 
                     to: to, 
                     subject: 'Invoice #'+invoice_no+' | No Reply', 
                     html: text 
            };

            transporter.sendMail(mailOptions, function(error, info){
            if(!error){
                 console.log(info);
                 resolve();
            }
            else{
                 console.log(error);
                 reject();
            }
            });

        }


    });    

    console.log("mail sent");
    
 });
}

module.exports.forgotPassword = function(email,res) {

    return new Promise(function(resolve,reject){

        pool.query("SELECT UID,UserID,email FROM user WHERE email = '"+email+"'",function (err,rows) {
            if(err){
                throw err;
            }
            else if(rows.length == 1){
                var data = parse(rows);
                var token = jwt.sign({ UID: data[0].UID}, 'l00p' ,{expiresIn: 36000 });
                var to = data[0].email;
                var text = 'Hi '+data[0].UserID+"<br><br>Click here to reset password : http://192.168.1.235/proj/resetPass.html?reset="+token;
                var mailOptions = {
                         from: 'invoiceTracker003@gmail.com', 
                         to: to, 
                         subject: 'Reset Password | No Reply', 
                         html: text 
                }
                transporter.sendMail(mailOptions, function(error, info){
                if(!error){
                     console.log(info);
                     resolve();
                }
                else{
                     console.log(error);
                     reject();
                }
                });
                res.send("Success");

            }else{
                    res.send("Invalid Email!")
            }
        })    
    })
}



//  module.exports.forgotPassword = function(email) {
//                 var to = email;
//                 var text = 'Hi ';
//                 var mailOptions = {
//                          from: 'invoiceTracker003@gmail.com', 
//                          to: to, 
//                          subject: 'Reset Password | No Reply', 
//                          text: text 
//                 }
//                 transporter.sendMail(mailOptions, function(error, info){
//                 if(!error){
//                      console.log(info);
                    
//                 }
//                 else{
//                      console.log(error);
                    
//                 }
//                 });
// }