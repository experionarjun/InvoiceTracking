function login() {
    var Uname = document.forms['login']['Uname'].value;
    var pass = document.forms['login']['password'].value;
    pass = (Crypto.MD5(pass)).toString();
    var result = document.getElementById('result');
    axios.get('http://192.168.1.235:8080/login', {
        headers: {
            username: Uname,
            password: pass
        }
    }).then(function(response) {
        if (response.data.message === "Success") {
            result.style.color = 'green';
            result.innerHTML = "<span class='glyphicon glyphicon-ok-sign'></span> " + response.data.message;

        } else {

            result.innerHTML = "<span class='glyphicon glyphicon-ban-circle'></span> " + response.data.message;
        }
        if (response.data.type === "Admin") {

            setLocStorage(response.data);
            window.location = "AdminHome.html";

        } else if (response.data.type === "User") {
            console.log(response.data);
            setLocStorage(response.data);
            window.location = "Userhome.html";
        }
    }).catch(function(error) {
        console.log(error);
    });

}

function validation() {
     document.getElementById('resetSuccess').innerHTML = "";
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

function setLocStorage(response) {

    localStorage.setItem("UID", response.UID);
    localStorage.setItem("Role", response.type);
    localStorage.setItem("token", response.token);
}


function logoutClick () {
    
    $('#err').hide();
    $('#success').hide();
    $('#submitForgotPass').show();
    $('#forgotCont').show();
    $('#myModal').modal();
}
function forgot() {
             
            var result = document.getElementById("forgotEmail").value;
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (result != "" && re.test(result)) {
                axios.post('http://192.168.1.235:8080/login',{
                    email : result
                }).then(function(response){
                    if(response.data == "Invalid Email!"){
                        warning.innerHTML = response.data;
                        $('#err').show();
                        document.getElementById("forgotEmail").value = "";
                    }else{
                        $('#success').show();
                        $('#submitForgotPass').hide();
                        $('#forgotCont').hide();
                        document.getElementById("forgotEmail").value = "";
                    }
                })
            }else{
                warning.innerHTML = "Invalid E-mail!"
                $('#err').show();
                document.getElementById("forgotEmail").value = "";
            }
        
  
}

$(document).ready(function() {
    
    if(location.search == "?=ResetSuccess" ){
        $("#resetSuccess").css('color','green');
        document.getElementById('resetSuccess').innerHTML = "<span class='glyphicon glyphicon-ok-sign'></span> Successfully Updated! Please Login";

    }
})
