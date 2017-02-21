const express = require('express');
const mysql = require("mysql");
const cors = require("cors");

var jwt = require('jsonwebtoken');
var parse = require('./parse.js');
var app = express();
var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'l00p',
    database: 'person'
});




//function to validate if username/pass is null or too long
function valid(Uname, pass) {

    if (Uname.length === 0 || Uname.length > 20 || pass.length === 0 || pass.length > 32) {
        return false;
    }
    return true;
}


module.exports = function(Uname,pass,res){
	var result = {
            "status": "",
            "message": "",
            "type": null
        };

        if (valid(Uname, pass)) {

            pool.query("SELECT UID,password,RoleID from user where UserID ='" + Uname + "'", function(err, rows)

                {                
                    if (!err) {
                        if (rows.length > 0) {
                            var data = parse(rows);
                            if (pass == data[0].password) {
                                result.status = 200;
                                result.message = "Success";
                                result.UID = data[0].UID;
                                pool.query("SELECT RoleType from Role where RoleID ='" + data[0].RoleID + "'", function(err, rows) {
                                    var data = parse(rows);
                                    result.type = data[0].RoleType;
                                    var token = jwt.sign({ UID: result.UID, Role: result.type  }, 'l00p' ,{expiresIn: 3600 });
                                    result.token = token;
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

}