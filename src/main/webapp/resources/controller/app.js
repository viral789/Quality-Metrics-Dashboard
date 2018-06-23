(function () {

var app = angular.module('app',['ui.router', 'ui.bootstrap.tpls', 'ui.bootstrap', 'Controller', 'Service', 'Filter', 'Directive']);

app.config(['$stateProvider','$locationProvider', function ($stateProvider, $locationProvider) {
	
	    $stateProvider
	        .state('SprintDetails', {
	            url: '/SprintDetails',
	            templateUrl: 'resources/views/sprint.html',
	            controller: 'sprint'
	        })
	        .state('ProjectDetails',{
	        	url: '/ProjectDetails',
	        	templateUrl : 'resources/views/project.html',
	        	controller : 'projectController'
	        })
	        .state('GraphDetails',{
	        	url: '/GraphDetails',
	        	templateUrl : 'resources/views/graph.html',
	        	controller : 'graphController'
	        })
	        .state('index', {
	        	url: '/',
	            templateUrl: 'resources/views/index.html',
	            controller: 'index'
	        })
	        .state('login', {
	        	url: '/login',
	            templateUrl: 'resources/views/login.html',
	            controller: 'loginController'
	        })
	        .state('projectInSprint', {
	            url: '/projectInSprint/:id',
	            templateUrl: 'resources/views/projectInSprint.html',
	            controller: 'projectInSprintController'
	        });
	    
	   // $locationProvider.html5Mode(true);
}]);

}());