var table, row;
var cell = [];
var max = 5;
var invoice = {
        invoice_no: "",
        doi: "",
        cname: "",
        address: "",
        currency: "",
        dueDate: "",
        subtotal: "",
        total: "",
        list: "",
        flag: false,

    
        checkNull: function() {
            if (this.invoice_no === "") {
                alert("Enter Invoice No.!");
                invoice.flag = false;
            } else if (this.doi === "") {
                alert("Enter Date of Issue!");
                invoice.flag = false;
            } else if (this.cname === "") {
                alert("Enter Customers Name");
                invoice.flag = false;
            } else if (this.address === "") {
                alert("Enter Adress");
                invoice.flag = false;
            } else if (this.currency === "") {
                alert("Select currency");
               invoice.flag = false;
            } else if (this.dueDate === "") {
                alert("Enter Due Date");
                invoice.flag = false;
            } else if (list != "") {
                this.list.forEach(function(element) {
                    if (element.item === "") {
                        alert("Enter Item");
                       invoice.flag = false;
                    } else if (element.desc === "") {
                        alert("Enter Description");
                        invoice.flag = false;
                    } else if (isNaN(element.qty)) {
                        alert("Enter Valid Quantity ");
                        invoice.flag = false;
                    } else if (isNaN(element.unitp)) {
                        alert("Enter Unit Price");
                        invoice.flag = false;
                    }
                })
                
            }
            },

            getInvoice: function() {
                invoice.invoice_no = document.forms['create_invoice']['invoice_no'].value;
                invoice.doi = document.forms['create_invoice']['doi'].value;
                invoice.cname = document.forms['create_invoice']['cname'].value;
                invoice.address = document.forms['create_invoice']['address'].value;
                invoice.currency = document.forms['create_invoice']['currency'].value;
                invoice.dueDate = document.forms['create_invoice']['dueDate'].value;
                var j = 0;
                invoice.list = [];

                for (var i = 2; i < table.rows.length; i++) {
                    j = i - 1;
                    invoice.list.push({
                        item: document.forms['create_invoice']['item' + j].value,
                        desc: document.forms['create_invoice']['desc' + j].value,
                        qty: parseFloat(document.forms['create_invoice']['qty' + j].value),
                        unitp: parseFloat(document.forms['create_invoice']['unitp' + j].value),
                        price: document.getElementById('price' + j).value
                    });
                }
                invoice.subtotal = document.getElementById('subtotal').value;
                invoice.total = document.getElementById('mainTot').value;
                console.log(invoice);

            }

            insertToDB: function(){

            	console.log("hi");
            }
        }


        //----------ADD ROW-----------------------

        function submitValidation() {

            invoice.flag = true;
            if (max === 5) {
                alert("Insert Items");
            } else {
                invoice.getInvoice();
                invoice.checkNull();
                if(invoice.flag === true){
                	invoice.insertToDB();

                }
                
            }
        }

        function limit() {
            if (max > 0) {
                addRow();
            } else {
                alert("Max 5 items can be inserted");
            }
        }



        function addRow() {

            table = document.getElementById("invoiceList");
            row = table.insertRow(table.rows.length);
            for (var i = 0; i < 6; i++) {
                cell[i] = row.insertCell(i);


            }

            row.className = 'item-row';
            var n = table.rows.length - 2;
            cell[0].innerHTML = n;
            cell[1].innerHTML = "<input type='text' placeholder='Item' name='item" + n + "'>";
            cell[2].innerHTML = "<input type='text' placeholder='Description' name='desc" + n + "'>";
            cell[3].innerHTML = "<input type='text' placeholder='__' name='qty" + n + "' class='qty'>";
            cell[4].innerHTML = "<input type='text' placeholder='__' name='unitp" + n + "' class='cost' >";
            cell[5].innerHTML = "<span class='price' id='price" + n + "'>0.00</span>";
            max--;
            bind();
        }

        function resetList() {
            max = 5;
            invoice.list = "";
            console.log(table.rows.length);
            for (var i = table.rows.length - 1; i > 1; i--) {
                console.log(table.rows[i]);
                table.deleteRow(i);
            };


        }

        function bind() {
            $(".cost").blur(update_price);
            $(".qty").blur(update_price);
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
                $("#datepicker").datepicker();
                $("#datepicker2").datepicker();
            });
        });