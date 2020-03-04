var mysql = require('mysql');
function connect() {
		// on va foutre une recherche dans la base
	var con = mysql.createConnection({
		host     : '127.0.0.1',
		database : 'Players',
		user     : 'root',
		password : 'root'
	});
	con.connect(function(err) {
		if (err) {
			console.error('Error connecting: ' + err.stack);
			return;
		}
		console.log('Connected as id ' + con.threadId);
	});
	return con;
}
module.exports = connect;
/*
Requette modif
	con.query(sql, function (error) {
		// note il faut mettre res end dans cette fonction pour garder
		// le model non bloquant car chaque fonction s execute de facon asynchrone
		//if (error) // pas tres pratique car le serveur lache avec un throw
		//	throw error;
		if(error) {
			console.log(error);
			res.end("Serveur : Erreur insertion dans la base.");
			return;
		}
		res.end("Serveur : Succes insertion dans la base!");
		con.end();
	});
*/
/*
Requette fetch
	con.query('SELECT * FROM Personne', function (error, results, fields) {
		// note il faut mettre res end dans cette fonction pour garder
		// le model non bloquant car chaque fonction s execute de facon asynchrone
		//if (error) // pas tres pratique car le serveur lache avec un throw
		//	throw error;
		if(error) {
			console.log(error);
			return;
		}
		res.end(JSON.stringify(results));
		con.end();
	});
*/