(function () {

var directive = angular.module('Directive', []);

directive.directive('monitoringPaginate',function(){
  return {
      restrict:'E',
      scope: {
          'recordsPerPage' : "=",
          'list': "=",
          'currentIndex': "="
      },
      link: function($scope) {
      	
          $scope.getNumberOfPages = function(list,recordsPerPage){
              return Math.ceil(list.length/recordsPerPage);
          };
          
          $scope.getPages = function(list,recordsPerPage,currentIndex){
              var length = parseInt(list.length);
              var pages = Math.ceil(length/recordsPerPage);
              var arr = [];
              var size = pages;
              if(pages<=3){
                  for(var i=0;i<pages;i++)
                      arr.push(i);
                  return arr;
              }
              else{
                  if(currentIndex>=0&&currentIndex<pages-2){
                      for(var i=currentIndex;currentIndex<pages&&arr.length<=2;i++)
                          arr.push(i);
                      return arr;
                  }
                  else if(currentIndex==pages-2){
                      arr.push(currentIndex-1);
                      arr.push(currentIndex);
                      arr.push(currentIndex+1);
                      return arr;
                  }
                  else{
                      arr.push(currentIndex-2);
                      arr.push(currentIndex-1);
                      arr.push(currentIndex);
                      return arr;
                  }	
              }
          };

          $scope.changePageSize = function(){
              $scope.currentIndex = 0;
          };

          $scope.changeIndex = function(i){
              $scope.currentIndex = i;
          };

          $scope.decrementCurrentIndex = function(){
              if($scope.currentIndex>0)
                  $scope.currentIndex--;
          };

          $scope.incrementCurrentIndex = function(){
              if($scope.currentIndex<(Math.ceil($scope.list.length/$scope.recordsPerPage)-1))
                  $scope.currentIndex++;
          };
      },
     templateUrl: 'resources/views/paginationPage.html'
  };
});


//--------------------------------------trends directive-------------------------------------------
directive.directive('highChart', function(){
	return {
        restrict: 'E',
        template: '<div></div>',
        replace: true,

        link: function (scope, element, attrs) {
          
            scope.$watch(function() { return attrs.chart; }, function() {
        
              if(!attrs.chart) return;
              
              var chart = JSON.parse(attrs.chart);
            
              $(element[0]).highcharts(chart);
            
            });
        
        }
    }
});


//-------------------------------------scrolling using keyboard arrow key directive--------------------------------

directive.directive('shouldFocus', function(){
	return{
		restrict: 'A',
		link: function(scope,element,attrs){
			scope.$watch(attrs.shouldFocus, function(newVal, oldVal){
				if(newVal){
					elsment[0].scrollIntoView(false);
				}
			});
		}
	};
})

}());