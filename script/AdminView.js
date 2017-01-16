var invoice = {
    invoice_no: "",
    doi: "",
    cname: "",
    address: "",
    currency: "",
    dueDate: "",
    list: "",
}

function getInvoiceAdmin() {

	axios.get('http://127.0.0.1:8080/viewInvoiceAdmin')
    .then(function(response){
        console.log(response);

}