(function () {

var service = angular.module('Service', []);

service.service('graphService', function () {
  var temp = 0;
  var temparray = [];
  var name = '';
  this.get = function () {
      return temp;
  }
  this.set = function (id) {
      temp = id;
  }
  this.getArray = function(){
	  return temparray;
  }
  this.setArray = function(array){
	  temparray = array;
  }
  this.getName = function(){
	  return name;
  }
  this.setName = function(checkName){
	  name = checkName;
  }
});

service.factory('Tab1Name', function() {
	return{
		name : 'Fiscal Week'
	};
});

service.factory('Tab2Name', function() {
	return{
		name : 'Project'
	};
});

service.factory('Tab3Name', function() {
	return{
		name : 'Quality Metrics'
	};
});

service.service('urlName', function($http){
	this.getUrl = function(){
		var promise = $http({
			method : 'GET',
	        url : 'resources/scripts/url.property'
		})
		.success(function(data){
			return data;
		});
		return promise;
	};
});

}());