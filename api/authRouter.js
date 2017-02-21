const express = require("express")
const cors = require("cors");

var auth = require('./auth.js');
var app = express();

var authRouter = express.Router();

authRouter.use(function(req, res, next) {
    console.log("authRouter");
    var authHeader = req.headers.authorization;
    console.log("authHeader",authHeader);
    if (authHeader !== undefined) {
        authHeader = JSON.parse(authHeader);
        auth(authHeader.UID, authHeader.Role, authHeader.token)
            .then(function(js) {

                if (js.status === 200) {
                    next();
                }

            })
            .catch(function(js) {

                console.log(js);
            });
    }else{
    	res.end();
    }
})


module.exports = authRouter;