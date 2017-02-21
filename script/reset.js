var newPass,confirmPass,result;

function validate(){
	result = document.getElementById('result');
	newPass = document.getElementById('newPass').value;
	confirmPass = document.getElementById('confirmPass').value;
	var flag = 1;
	if(newPass == "" || confirmPass == ""){
		result.innerHTML = "<span class='glyphicon glyphicon-ban-circle'></span> Fields cannot be empty!";
		
	}else if(newPass !== confirmPass){
		result.innerHTML = "<span class='glyphicon glyphicon-ban-circle'></span> Password mismatch";
		document.getElementById('newPass').value = "";
		document.getElementById('confirmPass').value = "";
	}else if(newPass.length >20 || confirmPass.length >20){
		result.innerHTML = "<span class='glyphicon glyphicon-ban-circle'></span> Password too long";
		document.getElementById('newPass').value = "";
		document.getElementById('confirmPass').value = "";
	}else if(newPass.length <5 || confirmPass.length < 5){
		result.innerHTML = "<span class='glyphicon glyphicon-ban-circle'></span> Password too short";
		document.getElementById('newPass').value = "";
		document.getElementById('confirmPass').value = "";
	}
	else{
		reset();
	}

}

function reset () {

	var token = location.search.split("?reset=");
	token = token[1];
	newPass = (Crypto.MD5(newPass)).toString();

	console.log(token);
	axios.post('http://192.168.1.235:8080/reset/'+token,{
		newPassword : newPass
	}).then(function(response){
		if (response.data === "Successfully Updated!") {
            result.style.color = 'green';
            document.getElementById('newPass').value = "";
			document.getElementById('confirmPass').value = "";
            result.innerHTML = "<span class='glyphicon glyphicon-ok-sign'></span> " + response.data + " Please Login";
            window.location = "index.html?=ResetSuccess";
        }else{
        	result.innerHTML = response.data;
        }
	})
	
}