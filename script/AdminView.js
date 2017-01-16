// var invoice;

function getInvoiceAdmin() {

	axios.get('http://127.0.0.1:8080/viewInvoiceAdmin')
    .then(function(response){

        console.log(response);
        var invoice = response.data;
        var i = 1;
        var content="";

        invoice.forEach(function(element) {

        	var x = element.date_of_issue;
        	content += "<tr id='item-row1' onClick ='modalOpen("+element.InvoiceID+")'> <td id='no'>"+i+"</td> <td id='cname'>"+element.UserID+"</td> <td id='price'>"+element.currency+" "+element.total+"</td> <td id='dueDate'>"+x.substring(0,10)+"</td></tr>";

        	i++;

        })
        document.getElementById('invoiceRows').innerHTML = content;


     })

}


function modalOpen(invID){

	axios.get('http://127.0.0.1:8080/viewInvoiceAdmin/'+invID)
	.then(function(response){

		document.getElementById('invoice_no').innerHTML = response.data[0].invoice_no;
		document.getElementById('billto').innerHTML = response.data[0].UserID;
		document.getElementById('address').innerHTML = response.data[0].address;
		var x = response.data[0].date_of_issue;
		document.getElementById('dateofissue').innerHTML = x.substring(0,10);
		x = response.data[0].dueDate;
		document.getElementById('duedate').innerHTML = x.substring(0,10);
		var content = "";
		var i =1;
		response.data.forEach(function(element){
			content += "<tr> <td>"+i+"</td> <td>"+element.item+"</td><td>"+element.desc+"</td> <td>"+element.qty+"</td><td>"+element.unitp+"</td> <td>"+element.qty*element.unitp +" </td> </tr>" 

			i++;
		})
		document.getElementById('list').innerHTML = content;
		document.getElementById('mainTot').innerHTML = response.data[0].total;

	})


	modal.style.display = "block";
}