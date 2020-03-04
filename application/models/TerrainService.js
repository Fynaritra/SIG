var connection = require('../../Connection');
module.exports=class TerrainModel{
	constructor(){}
	//Avoir tous les proprios
	getProprietaires(){
		return new Promise((resolve, reject) =>{
			var sql = "SELECT * FROM PROPRIETAIRE";
			connection().query(sql, function(error, resultSet, fields){
				if(error){
					reject(error);
				}
				var data = [];
				for(var result in resultSet.rows){
					data.push(resultSet.rows[result]);
				}
				resolve(data);
			});
		})
	}
	//Avoir tous les terrains
	getTerrains(){
		return new Promise((resolve, reject) =>{
			var sql = "SELECT * FROM TITRE ORDER BY ANNEE ASC";
			connection().query(sql, function(error, resultSet, fields){
				if(error){
					reject(error);
				}
				var data = [];
				for(var result in resultSet.rows){
					data.push(resultSet.rows[result]);
				}
				resolve(data);
			});
		})
	}
	//Terrains filtres par categorie
	getBiens(categorie){
		return new Promise((resolve, reject) =>{
			var sql = "SELECT * FROM TITRE WHERE CATEGORIE LIKE '%"+categorie+"%'";
			connection().query(sql, function(error, resultSet, fields){
				if(error){
					reject(error);
				}
				var data = [];
				for(var result in resultSet.rows){
					data.push(resultSet.rows[result]);
				}
				resolve(data);
			});
		})
	}
	//Terrains filtres selon la surface
	getTerrainsBySurface(minValue, maxValue){
		return new Promise((resolve, reject) =>{
			var sqlQuery = "SELECT * FROM TITRE WHERE surfacePolygon BETWEEN " + minValue + " AND " + maxValue;
			connection().query(sqlQuery, function(error, resultSet, fields){
				if(error){
					reject(error);
				}
				var data = [];
				for(var result in resultSet.rows){
					data.push(resultSet.rows[result]);
				}
				resolve(data);
			})
		})
	}
	
	//Fonction de vérification de collision d'un polygone avec un autre
	verifIntersection(coordinates){
		return new Promise((reject, resolve)=>{
			var sql = "select * from TERRAIN where st_intersects(TERRAIN.GEOM, ST_Polygon(ST_GeomFromText('LINESTRING("+coordinates+")'), 0))";
			connection().query(sql, function(error, resultSet, fields){
				if(error!=null){
					reject(error);
				}
				var data = [];
				for(var result in resultSet.rows){
					data.push(resultSet.rows[result]);
				}
				resolve(data);
			});
		});
	}
	//Insertion de Terrain et calcul de prix
	getPrice(coordinates, radius){
		return new Promise((resolve, rejet) =>{
			var rayon = radius/1000;
		var sqlPrice = "SELECT AVG(PRIX) as average, COUNT(*) as nb FROM TERRAIN WHERE ST_WITHIN(TERRAIN.GEOM, ST_BUFFER(ST_Polygon(ST_GeomFromText('LINESTRING("+coordinates+")'), 0), "+rayon+"))";
			connection().query(sqlPrice, function(err, resultSet, fields){
				if(err!=null){
					rejet(err);
				}
				var data = [];
				for(var result in resultSet.rows){
					data.push(resultSet.rows[result]);
				}
				resolve(data);
			});
		});
	};
	insert(coordinates, proprietaire, radius, annee){
		return new Promise((resolve, reject) =>{
			//Moyenne des terrains à n miles autour du terrain à enregistrer
            let prix=10000;
			const promise2 = this.getPrice(coordinates,radius);
			promise2.then(function(object){
				if(object.length!=0){
					if(object[0].nb!=0){
						prix = object[0].average;
					}
				}
				// console.log(prix);
				var sql = "INSERT INTO TERRAIN VALUES(concat('T', NEXTVAL('terrain_sequence')), 'V1', '"+proprietaire+"', "+prix+", ST_POLYGON(ST_GeomFromText('LINESTRING("+coordinates+")'), 0), "+annee+")"; 
                connection().query(sql,function(error){
                    if(error){
                        reject(error);
                    }
                    else{
                        resolve("Success!");
                    }
                });
			});
                
        });
	}
	
	//Separation
	divideByTwo(coordonnees){
		return new Promise((resolve, reject)=>{
			var line = "ST_GeomFromText('LINESTRING (" + coordonnees + ")')";
			var sql = "SELECT splitResult.*,ST_AsText((ST_Dump(ST_Split(poly, line))).geom) As wkt FROM (SELECT tab.idTerrain, tab.annee, tab.idProprietaire, tab.prix,ST_GeomFromText('LINESTRING ("+coordonnees+")') As line, tab.geom As poly FROM TERRAIN as tab WHERE ST_Intersects(ST_GeomFromText('LINESTRING ("+coordonnees+")'),tab.geom) = true) As splitResult";
			connection().query(sql, function(error, resultSet, fields){
				if(error){
					resolve(error);
				}
				var data = [];
				for(var result in resultSet.rows){
					data.push(resultSet.rows[result]);
				}
				resolve(data);
			});
		});
	}

	//Distinction année
	getYears(){
		return new Promise((resolve, reject) =>{
			var sql = "SELECT DISTINCT(ANNEE) AS YEAR FROM Terrain ORDER BY YEAR ASC";
			connection().query(sql, function(error, resultSet, fields){
				if(error){
					resolve(error);
				}
				var data = [];
				for(var result in resultSet.rows){
					data.push(resultSet.rows[result]);
				}
				resolve(data);
				console.log(data);
			});
		});
	}
	getTerrainByYear(year){
		return new Promise((resolve, reject) =>{
			var sql = "SELECT * FROM Titre where ANNEE = " + year;
			
			connection().query(sql, function(error, resultSet, fields){
				if(error){
					resolve(error);
				}
				var data = [];
				for(var result in resultSet.rows){
					data.push(resultSet.rows[result]);
				}
				resolve(data);
			});
		});
	}

}