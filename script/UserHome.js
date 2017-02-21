localStorage.Role = "User";
var cur = '*';
var invName;
var address;

function printDiv() {
    // var divToPrint=document.getElementById('myModal');
    // var newWin=window.open('','Print-Window');
    // newWin.document.open();
    // newWin.document.write('<html><body onload="window.print()">'+divToPrint.innerHTML+'</body></html>');
    // newWin.document.close();
    // setTimeout(function(){newWin.close();},10);

    var doc = new jsPDF();
    var specialElementHandlers = {
        '#editor': function(element, renderer) {
            return true;
        }
    };

    doc.fromHTML($('#myModal').get(0), 10, 10, {
        'width': 180,
        'elementHandlers': specialElementHandlers

    });
    doc.output("dataurlnewwindow");
}
$(document).ready(function() {

    $('#cmd').click(function() {
        var doc = new jsPDF();
        var specialElementHandlers = {
            '#editor': function(element, renderer) {
                return true;
            }
        };

        doc.fromHTML($('#myModal').get(0), 10, 10, {
            'width': 180,
            'elementHandlers': specialElementHandlers

        });
        // doc.fromHTML($('#myModal').html(), 1, 1, {
        //     'width': 50,
        //         'elementHandlers': specialElementHandlers
        // });
        // window.location.reload();
        doc.save(invName + ".pdf");
        //doc.output("dataurlnewwindow");
    })
})

function getInvoiceUser() {

    var validate = {
        UID: localStorage.UID,
        Role: localStorage.Role,
        token: localStorage.token
    };
    validate = JSON.stringify(validate);
    axios.get('http://192.168.1.235:8080/auth/user/Invoice', {
            headers: {
                'Authorization': validate
            }
        })
        .then(function(response) {

            var invoice = response.data;
            var i = 1;
            var content = "";

            invoice.forEach(function(element) {

                if (element.currency == 'USD') {
                    cur = '$';
                } else if (element.currency == 'INR') {
                    cur = ' &#8377;';
                } else {
                    cur = '&euro;';
                }
                var doi = new Date(element.date_of_issue);
                doi = doi.toLocaleDateString()
                doi = doi.split('/').join('-');
                var due = new Date(element.dueDate);
                due = due.toLocaleDateString()
                due = due.split('/').join('-');
                content += "<tr class='item-row' data-invoice=" + element.InvoiceID + "> <td id='no'>" + i + "</td> <td id='invoiceno'>" + element.invoice_no + "</td> <td id='doi'>" + doi + "</td><td id='price'>" + cur + " " + element.total + "</td><td id='status'><b>" + element.status + "</b></td> <td id='dueDate'>" + due + "</td></tr>";
                i++;


            })
            document.getElementById('invoiceRows').innerHTML = content;
            statusColor();
            $(".item-row").click(modalOpen);
            $('#invoiceList').DataTable();

        })

}


function modalOpen() {
    var invID = this.getAttribute("data-invoice") || 60;
    var validate = {
        UID: localStorage.UID,
        Role: localStorage.Role,
        token: localStorage.token
    };
    validate = JSON.stringify(validate);
    axios.get('http://192.168.1.235:8080/auth/Invoice/' + invID, {
            headers: {
                'Authorization': validate
            }
        })
        .then(function(response) {

            cur = response.data[0].currency;
            if (cur == 'USD') {
                cur = '$';
            } else if (cur == 'INR') {
                cur = ' &#8377;';
            } else {
                cur = '&euro;';
            }
            document.getElementById('invoice_no').innerHTML = response.data[0].invoice_no;
            invName = response.data[0].invoice_no;
            document.getElementById('billto').innerHTML = response.data[0].UserID;
            address = response.data[0].address;
            address = address.split(',').join(',<br>')
            document.getElementById('address').innerHTML = address;
            var date = new Date(response.data[0].date_of_issue)
            date = date.toLocaleDateString()
            date = date.split('/').join('-');
            document.getElementById('dateofissue').innerHTML = date;
            date = new Date(response.data[0].dueDate)
            date = date.toLocaleDateString()
            date = date.split('/').join('-');
            document.getElementById('duedate').innerHTML = date;
            var content = "";
            var i = 1;
            response.data.forEach(function(element) {
                content += "<tr> <td>" + i + "</td> <td>" + element.item + "</td><td>" + element.desc + "</td> <td>" + element.qty + "</td><td>" + cur + " " + element.unitp + "</td> <td>" + cur + " " + element.qty * element.unitp + " </td> </tr>"

                i++;
            })
            document.getElementById('list').innerHTML = content;
            document.getElementById('subtotal').innerHTML = cur + " " + response.data[0].total;
            document.getElementById('mainTot').innerHTML = cur + " " + response.data[0].total;

        })


    $("#myModal").modal();
}

function statusColor() {

    $('#invoiceList > tbody  > tr').each(function() {
        var content = this.cells[4].childNodes[0].innerHTML;
        if (this.cells[4].childNodes[0].innerHTML == "Pending") {

            this.cells[4].childNodes[0].innerHTML = "<span class='glyphicon glyphicon-exclamation-sign' style='color:#EE3233'></span> "
            this.cells[4].childNodes[0].innerHTML += content;
        } else {

            this.cells[4].childNodes[0].innerHTML = "<span class='glyphicon glyphicon-ok-sign' style='color: green' ></span> "
            this.cells[4].childNodes[0].innerHTML += content;
        }
    })
}