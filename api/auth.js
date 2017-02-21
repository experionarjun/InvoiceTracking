const express = require('express');
const cors = require("cors");

var jwt = require('jsonwebtoken');
var app = express();

var js = {
    status: 404,
    message: "Not Found"
};



module.exports = function(UID, Role, token) {
    return verification(UID,Role,token);
}


function verification(UID,Role,token) {
    return new Promise(function(resolve, reject){

    var decoded = jwt.verify(token, 'l00p', function(err, decoded) {
        console.log(decoded);
        if (err) {
            js.status = 404;
            js.message ="Token Expired";
            reject(js);
           
        } else {
        
            if (UID == decoded.UID && Role == decoded.Role) {

                js.status = 200;
                js.message = "found";

            }else{
                js.status = 404;
                js.message = "Not Found";
            }
            resolve(js);
        }
        
    });
    

    })
}