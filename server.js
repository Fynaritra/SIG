var express = require('express');

var Connection = require('./Connection');
var app = express(); // initialisation de l application
var errorResultatMessage = "Serveur : Erreur, le serveur repond mais la base non"; // juste une convention que j ai faite
// important surtout quand on travaille en local et pour les verbes
// cross origin :: avoir des trucs en ajax par exemple sur des dom diffs

var bodyParser = require('body-parser'); 
var terrainService = require('./application/models/TerrainService');
var service = new terrainService();
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

app.use(bodyParser.json());//Lit l'élément Json dans l'url(s'il y en a)
app.use(bodyParser.urlencoded({ extended: true })); // Supporte les bodies encodés

// le chemin api fait reference a application
app.use('/', express.static('application'));

app.get('/proprios', (req, res) =>{
	const promise = service.getProprietaires();
	promise.then(function(value){
		res.end(JSON.stringify(value));
	});
});
app.get('/terrains', (req, res) =>{
	const promise = service.getTerrains();
	promise.then(function(value){
		res.end(JSON.stringify(value));
	});
});
app.get('/years', (req, res) =>{
	const promise = service.getYears();
	promise.then(function(value){
		res.end(JSON.stringify(value));
	});
});

app.post('/year', (req, res) =>{
	const promise = service.getTerrainByYear(req.body.year);
	promise.then(function (value){
		res.end(JSON.stringify(value));
	}).catch(function (error){
		res.end(JSON.stringify(error));
	});
});
app.post('/categorie', (req, res) =>{
	var categ = req.body.categorie;
	const promise = service.getBiens(categ);
	promise.then(function(value){
		res.end(JSON.stringify(value));
	});
});
app.post('/searchBySurface', (req, res) =>{
	var minValue = req.body.minimum;
	var maxValue = req.body.maximum;
	const promise = service.getTerrainsBySurface(minValue, maxValue);
	promise.then(function(value){
		res.end(JSON.stringify(value));
	});
});
app.post('/prix', (req, res) =>{
	const promise = service.getPrice(req.body.coordinates, req.body.radius);
	promise.then(function(value){
		res.end(JSON.stringify(value));
	});
});
app.post('/insertion', (req, res) =>{
	var proprietaire = req.body.proprietaire;
	const promise = service.verifIntersection(req.body.coordinates);
	promise.then(function(value){
		if(value.length!=0){
			res.end("Intersection avec un autre terrain");
		}else{
			const promise2 = service.insert(req.body.coordinates, req.body.proprietaire, req.body.radius, req.body.annee);
			promise2.then(function(value2){
				res.end(value2);
			});
		}
	}).catch(function(error){
		// console.log("erreur");
		if(error.length!=0){
			res.end("Intersection avec un autre terrain");
		}else{
			const promise2 = service.insert(req.body.coordinates, req.body.proprietaire, req.body.radius, req.body.annee);
			promise2.then(function(value2){
				res.end(JSON.stringify(value2));
			}).catch(function(err){
				console.log(err);
			});
		}
	});
});
app.post('/split', (req, res) =>{
	const promise = service.divideByTwo(req.body.coordinates);
	
	promise.then(function(value){
		console.log("Length value " + value.length);
		var i = 0;
		for(i=0;i<value.length;i++){
			var sql = "INSERT INTO TERRAIN VALUES(concat('T', NEXTVAL('terrain_sequence')), 'V1', '"+req.body.proprietaire+"',"+value[i].prix+", '"+value[i].wkt+"', "+ req.body.year+")";
			Connection().query(sql, function(error){
				console.log("Insertion");
				if(error){
					res.end(JSON.stringify(error));
					console.log("err");
				}
			});
		}
		console.log("Success");
	});
});

var port = 1441;
var server = app.listen(port, function(){
	console.log("Demarrage sur localhost: "+port);
}); // le port qu'on bind
