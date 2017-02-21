localStorage.Role = 'Admin';
var validate = {
    UID: localStorage.UID,
    Role: localStorage.Role,
    token: localStorage.token
};
validate = JSON.stringify(validate);

var table, row, cflag = false;
var cell = [];
var max = 10,
    x = 0;
var warning;

var invoice = {
    invoice_no: "",
    doi: "",
    cname: "",
    address: {},
    currency: "",
    dueDate: "",
    total: "",
    list: "",
};


function makeid() {
    // var text = "INV/";
    // var possible = "0123456789";
    // for (var i = 0; i < 2; i++)
    //     text += possible.charAt(Math.floor(Math.random() * possible.length));
    // possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    // text += "/";
    // for (i = 0; i < 3; i++)
    //     text += possible.charAt(Math.floor(Math.random() * possible.length));
    // possible = "0123456789";
    // for (i = 0; i < 2; i++)
    //     text += possible.charAt(Math.floor(Math.random() * possible.length));
    // document.forms['create_invoice']['invoice_no'].value = text;

    var date = new Date();
    var text = date.getFullYear();
    text += '/';
    mm = date.getMonth() + 1;
    if (mm < 10) {
        text += '0' + mm;
    } else {
        text += mm;
    }
    text += '/';
    possible = "0123456789";
    for (i = 0; i < 6; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    document.forms['create_invoice']['invoice_no'].value = text;
    date = date.toLocaleDateString()
    date = date.split('/').join('-');
    document.forms['create_invoice']['doi'].value = date;
    setDueDate();

}

var checkNull = function() {
    if (invoice.invoice_no === "") {
        warning.innerHTML = "Enter Invoice No.!";
        $('#err').show();
        cflag = false;
    } else if (invoice.doi === "" || invoice.doi == "Invalid Date") {
        warning.innerHTML = "Enter Date of Issue!";
        $('#err').show();
        cflag = false;
    } else if (invoice.dueDate === "" || invoice.dueDate == "Invalid Date" || invoice.doi > invoice.dueDate) {
        warning.innerHTML = "Enter Valid Due Date";
        $('#err').show();
        cflag = false;
    } else if (invoice.cname === "") {
        warning.innerHTML = "Enter Customers Name";
        $('#err').show();
        cflag = false;
    } else if (invoice.address.line === "") {
        warning.innerHTML = "Enter Address";
        $('#err').show();
        cflag = false;
    } else if (invoice.address.city === "") {
        warning.innerHTML = "Enter City";
        $('#err').show();
        cflag = false;
    } else if (invoice.address.state === "") {
        warning.innerHTML = "Enter Address";
        $('#err').show();
        cflag = false;
    } else if (isNaN(invoice.address.zip) || invoice.address.zip.toString().length != 6 || invoice.address.zip < 0) {
        warning.innerHTML = "Enter Valid Zip";
        $('#err').show();
        cflag = false;
    } else if (invoice.address.country === "") {
        warning.innerHTML = "Enter Country";
        $('#err').show();
        cflag = false;
    } else if (invoice.currency === "") {
        warning.innerHTML = "Select currency";
        $('#err').show();
        cflag = false;
    } else if (list !== "") {
        invoice.list.forEach(function(element) {
            if (element.item === "") {
                warning.innerHTML = "Enter Item";
                $('#err').show();
                cflag = false;
            } else if (element.desc === "") {
                warning.innerHTML = "Enter Description";
                $('#err').show();
                cflag = false;
            } else if (isNaN(element.qty)) {
                warning.innerHTML = "Enter Valid Quantity ";
                $('#err').show();
                cflag = false;
            } else if (isNaN(element.unitp)) {
                warning.innerHTML = "Enter Unit Price";
                $('#err').show();
                cflag = false;
            }
        });
    }
};

var getCname = function() {
    axios.get('http://192.168.1.235:8080/auth/customer', {
            headers: {
                'Authorization': validate
            }
        })
        .then(function(response) {

            console.log(response);
            response.data.forEach(function(element) {
                var nameValue = document.createElement("OPTION");
                nameValue.setAttribute("value", element.UID);
                var nameText = document.createTextNode(element.UserID);
                nameValue.appendChild(nameText);
                document.getElementById("cnameDroplist").appendChild(nameValue);
            });

        });


};

var getInvoice = function() {
    var create_invoice = document.forms['create_invoice'];
    invoice.invoice_no = create_invoice['invoice_no'].value;
    invoice.doi = new Date(create_invoice['doi'].value.split("-").reverse());
    invoice.cname = parseInt(create_invoice['cname'].value);

    invoice.address.line = create_invoice['address'].value;
    invoice.address.city = create_invoice['city'].value;
    invoice.address.state = create_invoice['state'].value;
    invoice.address.zip = parseInt(create_invoice['zip'].value);
    invoice.address.country = create_invoice['country'].value;

    invoice.currency = create_invoice['currency'].value;
    invoice.dueDate = new Date(create_invoice['dueDate'].value.split("-").reverse())

    var j = 0;
    var total = 0;
    invoice.list = [];

    for (var i = 2; i < table.rows.length; i++) {
        j = i - 1;
        invoice.list.push({
            item: create_invoice['item' + j].value,
            desc: create_invoice['desc' + j].value,
            qty: parseFloat(create_invoice['qty' + j].value),
            unitp: parseFloat(create_invoice['unitp' + j].value),
            price: document.getElementById('price' + j).value
        });

    }
    invoice.total = parseFloat(document.getElementById('mainTot').innerHTML);
    console.log(invoice);

};

function insertToDB() {
    axios.post('http://192.168.1.235:8080/auth/Invoice', {
        sendInvoice: invoice
    }, {

        headers: {
            'Authorization': validate
        }
    }).then(function(response) {
        console.log(response);
        if (response.data.status == 200) {
            $('#success').show();
            resetList();
            $('#mainTot').html('0.00');
            $('#subtotal').html('0.00');
            $("input[type=text], textarea").val("");
            $('select').val('');
            makeid();
        } else {
            warning.innerHTML = response.data.message;
            $('#err').show();

        }

    }).catch(function(err) {
        console.log(err);
    })
}

function submitValidation() {

    $("#success").hide();
    $('#err').hide();
    cflag = true;
    if (max === 10) {
        warning.innerHTML = "Insert Items";
        $('#err').show();
    } else {
        getInvoice();
        checkNull();
        if (cflag === true) {
            insertToDB();
        }

    }
}

function rowLimit() {
    if (max > 0) {
        $('#err').hide();
        addRow();
    } else {
        warning.innerHTML = "Max 10 items can be inserted";
        $('#err').show();
    }
}



function addRow() {

    table = document.getElementById("invoiceList");
    row = table.insertRow(table.rows.length);
    for (var i = 0; i < 7; i++) {
        cell[i] = row.insertCell(i);


    }

    row.className = 'item-row';
    var n = table.rows.length - 2;
    cell[0].innerHTML = n;
    cell[1].innerHTML = "<input type='text' class ='mobRes' placeholder='Item' name='item" + n + "'>";
    cell[2].innerHTML = "<input type='text' class ='mobRes' placeholder='Description' name='desc" + n + "'>";
    cell[3].innerHTML = "<input type='text' placeholder='__' name='qty" + n + "' class='qty mobRes'>";
    cell[4].innerHTML = "<input type='text' placeholder='__' name='unitp" + n + "' class='cost mobRes' >";
    cell[5].innerHTML = "<span class='price' id='price" + n + "'>0.00</span>";

    rmLink = document.createElement('a');
    cell[6].appendChild(rmLink);

    rmLink.innerHTML = "<span class='glyphicon glyphicon-remove-circle rm-row' id='rm-ro" + n + "'></span>";
    $('#rm-ro' + n).click(function() {
        console.log("cell", table.rows[2].cells[1].childNodes[0].name);

        if (max < 9) {
            max++;
            this.parentNode.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode.parentNode);
            for (i = 2; i < table.rows.length; i++) {
                table.rows[i].cells[0].innerHTML = i - 1;
                table.rows[i].cells[1].childNodes[0].name = "item" + (i - 1);
                table.rows[i].cells[2].childNodes[0].name = "desc" + (i - 1);
                table.rows[i].cells[3].childNodes[0].name = "qty" + (i - 1);
                table.rows[i].cells[4].childNodes[0].name = "unitp" + (i - 1);
                table.rows[i].cells[5].childNodes[0].id = "price" + (i - 1);
                table.rows[i].cells[6].childNodes[0].childNodes[0].id = "rm-ro" + (i - 1);
            }

        }
    });
    max--;
    bind();
}

function resetList() {
    max = 10;
    invoice.list = "";
    for (var i = table.rows.length - 1; i > 1; i--) {
        table.deleteRow(i);
    }
    addRow();
    $('#err').hide();

}

function bind() {
    $(".cost").keyup(update_price);
    $(".qty").blur(update_price);
    $(".rm-row").click(update_price);
}

function update_price() {
    var row = $(this).parents('.item-row');
    var price = row.find('.cost').val().replace("", "") * row.find('.qty').val();
    price = roundNumber(price, 2);
    isNaN(price) ? row.find('.price').html("N/A") : row.find('.price').html(price);
    update_total();
}

function update_total() {
    var total = 0;
    $('.price').each(function(i) {
        price = $(this).html().replace("", "");
        if (!isNaN(price)) total += Number(price);
    });

    total = roundNumber(total, 2);

    $('#subtotal').html("" + total);
    $('#mainTot').html("" + total);

}


function roundNumber(number, decimals) {
    var newString;
    decimals = Number(decimals);
    if (decimals < 1) {
        newString = (Math.round(number)).toString();
    } else {
        var numString = number.toString();
        if (numString.lastIndexOf(".") == -1) {
            numString += ".";
        }
        var cutoff = numString.lastIndexOf(".") + decimals;
        var d1 = Number(numString.substring(cutoff, cutoff + 1));
        var d2 = Number(numString.substring(cutoff + 1, cutoff + 2));
        if (d2 >= 5) {
            if (d1 == 9 && cutoff > 0) {
                while (cutoff > 0 && (d1 == 9 || isNaN(d1))) {
                    if (d1 != ".") {
                        cutoff -= 1;
                        d1 = Number(numString.substring(cutoff, cutoff + 1));
                    } else {
                        cutoff -= 1;
                    }
                }
            }
            d1 += 1;
        }
        if (d1 == 10) {
            numString = numString.substring(0, numString.lastIndexOf("."));
            var roundedNum = Number(numString) + 1;
            newString = roundedNum.toString() + '.';
        } else {
            newString = numString.substring(0, cutoff) + d1.toString();
        }
    }
    if (newString.lastIndexOf(".") == -1) {
        newString += ".";
    }
    var decs = (newString.substring(newString.lastIndexOf(".") + 1)).length;
    for (var i = 0; i < decimals - decs; i++) newString += "0";
    return newString;
}

$(document).ready(function() {
    $(function() {
        $("#datepicker").datepicker({
            dateFormat: 'dd-mm-yy'
        });
        $("#datepicker2").datepicker({
            dateFormat: 'dd-mm-yy'
        });

    });


    $('#cnameDroplist').change(function() {
        var UID = parseInt(this.value);

        console.log(UID);

        axios.get('http://192.168.1.235:8080/auth/customer/' + UID, {
                headers: {
                    'Authorization': validate
                }
            })
            .then(function(response) {
                var create_invoice = document.forms['create_invoice'];
                create_invoice['address'].value = response.data[0].address;
                create_invoice['address'].setAttribute("disabled", true);
                create_invoice['city'].value = response.data[0].city;
                create_invoice['city'].setAttribute("disabled", true);
                create_invoice['state'].value = response.data[0].state;
                create_invoice['state'].setAttribute("disabled", true);
                create_invoice['zip'].value = response.data[0].zip;
                create_invoice['zip'].setAttribute("disabled", true);
                create_invoice['country'].value = response.data[0].country;
                create_invoice['country'].setAttribute("disabled", true);
                $("#editAddress").show();

            })
            .catch(function(err) {
                console.log(err);
            })
    })
});


$(document).ready(function() {
    $('#success').hide();
    $("#editAddress").hide()
    $("#cancelAddress").hide()
    warning = document.getElementById('warning');
    $('#err').hide();
    $('#saveAddress').hide();
    makeid();
    getCname();
    addRow();
    $('#datepicker').change(setDueDate)

    $('#editAddress').click(function() {

        if(confirm("Do you want to edit Address?")){
            $("#editAddress").hide()
            var create_invoice = document.forms['create_invoice'];
            create_invoice['address'].removeAttribute("disabled");
            create_invoice['city'].removeAttribute("disabled");
            create_invoice['state'].removeAttribute("disabled");
            create_invoice['zip'].removeAttribute("disabled");
            create_invoice['country'].removeAttribute("disabled");

            create_invoice['address'].style.backgroundColor = '#efefef';
            create_invoice['city'].style.backgroundColor = '#efefef';;
            create_invoice['state'].style.backgroundColor = '#efefef';
            create_invoice['zip'].style.backgroundColor = '#efefef';
            create_invoice['country'].style.backgroundColor = '#efefef';
           $('#saveAddress').show();
           $("#cancelAddress").show()
           $('#saveAddress').click(function() {
                create_invoice['address'].setAttribute("disabled", true);
                create_invoice['city'].setAttribute("disabled", true);
                create_invoice['state'].setAttribute("disabled", true);
                create_invoice['zip'].setAttribute("disabled", true);
                create_invoice['country'].setAttribute("disabled", true);

                create_invoice['address'].style.backgroundColor = '#fcfcfc';
                create_invoice['city'].style.backgroundColor = '#fcfcfc';;
                create_invoice['state'].style.backgroundColor = '#fcfcfc';
                create_invoice['zip'].style.backgroundColor = '#fcfcfc';
                create_invoice['country'].style.backgroundColor = '#fcfcfc';
                 $('#saveAddress').hide();
                 $("#cancelAddress").hide();
                  $("#editAddress").show()
       })
    $("#cancelAddress").click(function(){
        var UID = document.getElementById("cnameDroplist").value;
        axios.get('http://192.168.1.235:8080/auth/customer/' + UID, {
                headers: {
                    'Authorization': validate
                }
            })
            .then(function(response) {
                var create_invoice = document.forms['create_invoice'];
                create_invoice['address'].value = response.data[0].address;
                create_invoice['address'].setAttribute("disabled", true);
                create_invoice['city'].value = response.data[0].city;
                create_invoice['city'].setAttribute("disabled", true);
                create_invoice['state'].value = response.data[0].state;
                create_invoice['state'].setAttribute("disabled", true);
                create_invoice['zip'].value = response.data[0].zip;
                create_invoice['zip'].setAttribute("disabled", true);
                create_invoice['country'].value = response.data[0].country;
                create_invoice['country'].setAttribute("disabled", true);

                create_invoice['address'].style.backgroundColor = '#fcfcfc';
                create_invoice['city'].style.backgroundColor = '#fcfcfc';;
                create_invoice['state'].style.backgroundColor = '#fcfcfc';
                create_invoice['zip'].style.backgroundColor = '#fcfcfc';
                create_invoice['country'].style.backgroundColor = '#fcfcfc';
                $("#editAddress").show();
                $('#saveAddress').hide();
                $("#cancelAddress").hide();

            })
            .catch(function(err) {
                console.log(err);
            })

    })
    }

    })
})

function setDueDate(){
        var dueDate = new Date(document.forms['create_invoice']['doi'].value.split("-").reverse());
        dueDate.setDate(dueDate.getDate() + 15);
        dueDate = dueDate.toLocaleDateString();
        dueDate = dueDate.split('/').join('-');
        document.forms['create_invoice']['dueDate'].value = dueDate;
        
    }