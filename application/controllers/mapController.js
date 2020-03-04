function formatCoordonnees(terrain1){
	var coo = "";
	for(var f=0;f<terrain1.length;f++){
		coo += terrain1[f].latitude + " " + terrain1[f].longitude;
		coo += ",";
	}
	coo += terrain1[0].latitude + " " + terrain1[0].longitude;
return coo;
};
function formatLine(terrain1){
	var coo = "";
	for(var f=0;f<terrain1.length;f++){
		coo += terrain1[f].latitude + " " + terrain1[f].longitude;
		if(f<terrain1.length-1){
			coo += ",";
		}
	}
return coo;
}

terrainApp.controller('mapController', function($scope, $http, $location){
	$scope.somme = 0;
	$scope.annee = 1991;
	$scope.rayon = 1;
	$scope.moyenne = 0;
	$scope.listeTerrains = [];
	$scope.proprio = 'P1';
	$scope.prixEvaluation = "";
	$scope.erreurPolygone = "";
	$scope.listeProprio = [];
	let polygons = [];
	var Layers = []
	var CoordinatesNewLayer = [];
	var CoordinatesTempLayer = [];
	
    var map = L.map('map',
	{
		//maxBounds: bounds
	}).setView([-18.975171, 47.544723],14); //Initialisation de la carte     
    var osmLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', { //Avoir les layers de OSM
        attribution: 'Â© OpenStreetMap contributors',
        maxZoom: 19
	});
	
	//Tous les proprietaires
	$http({method: 'GET', url: '/proprios' })
	.then(function successCallback(response) {
		var proprietaires = response.data;
		proprietaires.forEach(element =>{
			$scope.listeProprio.push(element);
		});
	},function errorCallback(response) {
		console.log("Server response failed : " + response);
	});
	
	
	$scope.avoirTerrain = function(){
		$http({method: 'GET', url: '/terrains' })
		.then(function successCallback(responses) {
			$scope.listeTerrains = [];
			var terrains = responses.data;
			terrains.forEach(element =>{
				$scope.listeTerrains.push(element);
			});
		},function errorCallback(response) {
			console.log("Server response failed : " + response);
		});
	}
	
	//Recherche selon catégorie de propriétaire
	$scope.showCategories = function(){
		$scope.clearMap();
		var data = {
			categorie : $scope.type
		};
		$http.post('/categorie', data)
		.then(function successCallback(response) {
			$scope.clearMap();
			var terrainFiltres = response.data;
			terrainFiltres.forEach(filtre =>{
				polygons.push(filtre);
			});
			$scope.showTerrains();
		},function errorCallback(response) {
			console.log(response);
		});
	}
	
	//Recherche de terrain selon leurs surfaces
	$scope.surfaceSearch = function(){
		var data = {
			minimum : $scope.minValue,
			maximum : $scope.maxValue
		};
		$scope.clearMap();
		$http.post('/searchBySurface', data)
		.then(function successCallback(response){
			var results = response.data;
			
			results.forEach(element =>{
				polygons.push(element);
			});
			$scope.showTerrains();
		}, function errorCallback(response) {
			console.log(response);
		});
	};
	
	//Suppression de tous les elements sur la carte(terrains)
	$scope.clearMap = function(){
		Layers.forEach(element =>{
			map.removeLayer(element);
		});
		polygons = [];
		Layers = [];
	};
	
	//Réinitialisation(affichage de tous les terrains existants dans la BDD)
	$scope.reload = function(){
		$http({method: 'GET', url: '/terrains' })
		.then(function successCallback(response) {
			$scope.clearMap();
			var terrains = response.data;
			terrains.forEach(element =>{
				polygons.push(element);
			});
			$scope.showTerrains();
			$scope.avoirTerrain();

		},function errorCallback(response) {
			console.log("Server response failed : " + response);
		});
	};
		
	//Affichage des objets stockés dans Layers
	$scope.showTerrains = function(){
		$scope.somme = 0;
		$scope.moyenne = 0;
		polygons.forEach(polygon =>{
			var temp = L.polygon(JSON.parse(polygon.coordonnees).coordinates[0]);
			Layers.push(temp);
			temp.bindPopup("Propriétaire: " + polygon.nom + "</br>" + polygon.nationalite + " " + polygon.categorie + "</br>" + "Surface: " + (polygon.surfacepolygon).toFixed(2) + " m² </br> Prix du m²: " + polygon.prix + " Ariary" + "</br>" + polygon.annee);
			temp.addTo(map);
			$scope.somme += Math.round(polygon.prix);
		});
		$scope.moyenne = Math.round($scope.somme / polygons.length);
	};
	//Ajout de la couche d'OSM sur la carte
	map.addLayer(osmLayer);
	
	//Ajout de terrain en live
	// Initialise le groupe de fonctionnalites
	var editableLayers = new L.FeatureGroup();
	map.addLayer(editableLayers);
	
	//Options de dessin(polygone, lignes, ...)
	var drawPluginOptions = {
		position: 'topright',
		draw: {
			polygon: {
			allowIntersection: false, //Restriction des formes pour qu'on puisse dessiner des polygones uniquement
			drawError: {
			color: '#e1e100', //Couleur lors de l'intersection des cotes du polygone
			message: '<strong>Attention!<strong> Intersection avec un autre terrain non permise' //Message d'erreur lors de l'intersection
		},
		shapeOptions: {
			color: 'red'
		}
		},
		//Desactiver les autres fonctionnalites
		// polyline: false,
		circle: false, 
		rectangle: false,
		marker: false,
		circlemarker : false,
		},
	    edit: {
		featureGroup: editableLayers, //REQUIRED!!
		remove: false,
		edit: false
	  }
	};
	
	// Initialise le controle et le passer a la liste de fonctionnalites
	var drawControl = new L.Control.Draw(drawPluginOptions);
	map.addControl(drawControl);
	var editableLayers = new L.FeatureGroup();
	map.addLayer(editableLayers);

	map.on('draw:created', function(e) {
		var type = e.layerType,
		layer = e.layer;
		editableLayers.addLayer(layer);
		CoordinatesNewLayer.push(CoordinatesTempLayer);
		CoordinatesTempLayer = [];
		console.log(CoordinatesNewLayer.length);
	});
	
	$scope.annuler = function(){
		CoordinatesNewLayer = [];
		CoordinatesTempLayer = [];
		$scope.erreurPolygone = "Terrain supprimé!";
		setTimeout(function(){
			document.location.reload()
		}, 500);
	};
	map.on("click",function(ev){
		var latitude = ev.latlng.lat;
		var longitude = ev.latlng.lng;
		var tempCoordinates = {latitude, longitude};
		CoordinatesTempLayer.push(tempCoordinates);
		console.log(tempCoordinates);
	});
	
	$scope.register = function(){
		if(CoordinatesNewLayer.length!=0){
			var coordonnees = "";
			var terrain1 = CoordinatesNewLayer[0];
			if(terrain1.length>2){
				coordonnees = formatCoordonnees(terrain1);
				var data = {
					coordinates: coordonnees,
					proprietaire: $scope.proprio,
					radius: $scope.rayon,
					annee: $scope.annee
				}
				$http.post('/insertion', data)
				.then(function successCallback(response) {
					$scope.errorCarte = response.data;
					CoordinatesNewLayer = [];
					$scope.avoirTerrain();
					
					setTimeout(function(){
						document.location.reload()
					}, 7000);
				},function errorCallback(response) {
					console.log(response);
				});

			}
		}else{
			$scope.erreurPolygone = "Veuillez créer le terrain";
		}
	};
	
	$scope.divide = function(){
		if(CoordinatesNewLayer.length!=0){
			var coordonnees = "";
			var terrain1 = CoordinatesNewLayer[0];
			coordonnees = formatLine(terrain1);
			console.log(coordonnees);
			var data = {
				coordinates : coordonnees,
				year : $scope.annee,
				proprietaire: $scope.proprio
			};
			$http.post('/split', data)
			.then(function successCallback(response){
				console.log("resp " + response);
				CoordinatesNewLayer = [];
				document.location.reload();
			}, function errorCallback(response){
				console.log(response);
			});
		}else{
			$scope.erreurPolygone = "Veuillez former la ligne de division";
		}
	};

	//Evaluation de prix d'un terrain
	$scope.evaluate = function(){
		if(CoordinatesNewLayer.length!=0){
			var coordonnees = "";
			var terrain1 = CoordinatesNewLayer[0];
			coordonnees = formatCoordonnees(terrain1);
			var data = {
				coordinates: coordonnees,
				radius: $scope.rayon
			}
			$http.post('/prix', data)
			.then(function successCallback(response) {
				var tempRes = response.data;
				console.log(tempRes);
				if(tempRes[0].nb == 0){
					$scope.errorCarte = "";
					$scope.errorCarte = "Prix minimum de 10.000 Ariary";
				}else{
					$scope.prixEvaluation = tempRes[0].average;
					$scope.errorCarte = "Prix d'évaluation";
				}
			},function errorCallback(response) {
				console.log(response);
			});
		}else{
			$scope.errorCarte = "Veuillez créer le terrain";
		}
	}
	
	//Bouton play
	$scope.playHistory = function(){
		$http({method: 'GET', url: '/years' })
		.then(function successCallback(response){
			var results = response.data;
			var i = 0;
			
			setInterval(function(){
				if(i<results.length){
					var data = {
						year : results[i].year
					}
					$http.post('/year', data)
					.then(function successCB(titles){
						$scope.clearMap();
						var terrains = titles.data;
						console.log(titles);
						terrains.forEach(el=>{
							polygons.push(el);
						});
						$scope.showTerrains();
					}, function errorCallback(titles){
						
					});
					i++;
				}
			}, 5000);
			
		}, function errorCallback(response){
			console.log("Echec");
		});
	}
});