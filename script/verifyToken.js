function verify(role) {

    console.log(role);
    axios.post("http://192.168.1.235:8080/auth", {
        UID: localStorage.UID,
        Role: role,
        token: localStorage.token
    }).then(function(response) {

        if (response.data.status === 404) {
            window.location = "index.html";
        }
    })

}



function logout() {
   localStorage.removeItem('UID');
   localStorage.removeItem('Role');
   localStorage.removeItem('token');
    window.location = 'index.html'
}