var database = require('pg');
let configuration = "postgres://postgres:0000@localhost:5432/terrainsig";

function Connection(){
	const connection = new database.Client(configuration);
	connection.connect(function(err){
		if(err){
			console.log(err);
		}
	});
return connection;
}
module.exports = Connection;