const express = require('express');
const mysql = require("mysql");
const cors = require("cors");


var app = express();
var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'l00p',
    database: 'person'
});
var parse = require('./parse.js');


//function to validate if username/pass is null or too long
function valid(Uname, pass) {

    if (Uname.length === 0 || Uname.length > 20 || pass.length === 0 || pass.length > 32) {
        return false;
    }
    return true;
}


module.exports.login = function(Uname,pass,res){
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


                            var data = parse.parse(rows);

                            if (pass == data[0].password) {
                                result.status = 200;
                                result.message = "Success";
                                pool.query("SELECT RoleType from Role where RoleID ='" + data[0].RoleID + "'", function(err, rows) {
                                    var data = parse.parse(rows);
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

}