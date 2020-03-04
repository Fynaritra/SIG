var terrainApp = angular.module('terrainApp', ['ngRoute']);

terrainApp.config(function($routeProvider, $locationProvider){
	$routeProvider
	.when('/',{
		templateUrl: '/views/map.html',
        controller : 'mapController'
	});
	$locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});

terrainApp.controller('indexController', function($scope){
	$scope.url_navbar = 'views/navbar.html';
});