function login() {
    var Uname = document.forms['login']['Uname'].value;
    var pass = document.forms['login']['password'].value;
    pass = (Crypto.MD5(pass)).toString();
    var result = document.getElementById('result');
    axios.post('http://127.0.0.1:8080/login', {
        userName: Uname,
        password: pass
    }).then(function(response) {
        result.innerHTML = "<span class='glyphicon glyphicon-ban-circle'></span> " + response.data.message;
        if (response.data.type === "Admin") {
            window.location = "AdminHome.html";
        } else if (response.data.type === "User") {
            window.location = "Userhome.html";
        }
    }).catch(function(error) {
        console.log(error);
    });

}

function validation() {
    var result = document.getElementById('result');
    var Uname = document.forms['login']['Uname'].value;
    var pass = document.forms['login']['password'].value;
    var flag = true;
    if (Uname.length === 0 && pass.length === 0) {
        flag = false;
        result.innerHTML = "<span class='glyphicon glyphicon-ban-circle'></span> UserID and Password cannot be left blank!"
    } else if (Uname.length === 0 || Uname.length > 20) {
        flag = false;
        result.innerHTML = "<span class='glyphicon glyphicon-ban-circle'></span> Invalid UserID"
    } else if (pass.length === 0) {
        flag = false;
        result.innerHTML = "<span class='glyphicon glyphicon-ban-circle'></span> Password cannot be left blank!"
    }
    if (flag != false) {
        login();
    }

}