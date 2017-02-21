
module.exports = function(rows) {

	var data = JSON.stringify(rows);
	    data = JSON.parse(data);
	    return data;
}