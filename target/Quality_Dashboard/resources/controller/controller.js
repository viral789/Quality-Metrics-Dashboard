(function () {

var controller = angular.module('Controller', []);

//------------------------------index.html controller-----------------------------------
controller.controller('index', ['$scope', '$state', 'urlName', function($scope, $state, urlName){
	 
	admin1 = '';
	admin2 = '';
	urlName.getUrl().then(function(response){
		 urlBase = response.data.url;
	 });
	 $scope.template = "resources/views/dashboard.html";
	   
	 $state.go("SprintDetails");
}]);


//---------------------------dashboard.html-------------------------------

controller.controller('dashboard', ['$scope', '$state', 'Tab1Name', 'Tab2Name', 'Tab3Name', 'urlName', '$modal', '$rootScope', function($scope, $state, Tab1Name, Tab2Name, Tab3Name, urlName, $modal, $rootScope){

	
	urlName.getUrl().then(function(response){
		 urlBase = response.data.url;
		 admin1 = response.data.admin1;
		 admin2 = response.data.admin2;
	 });
	 
	$rootScope.$on('authenticate', function(event, flag){
		$scope.authenticate = flag;
	});
	
	$rootScope.$on('userName', function(event, flag){
		$scope.userName = flag;
	});
	
	$scope.tab1name = Tab1Name.name;
	$scope.tab2name = Tab2Name.name;
	$scope.tab3name = Tab3Name.name;
	
	$scope.active = function(route){
		return $state.is(route);
	}
	
	$scope.tabs =[
      { heading: "Fiscal Week Details", route:"SprintDetails", active:true },
      { heading: "Project Details", route:"ProjectDetails", active:false }, 
      { heading: "Quality Metrics Details", route:"GraphDetails", active:false }
	];
	
	$scope.$on("$stateChangeSuccess", function() {
		$scope.tabs.forEach(function(tab) {
			tab.active = $scope.active(tab.route);
		});
	});
	
	$scope.signin = function(){
		$modal.open({
            templateUrl: 'resources/views/login.html',
            controller: 'loginController',
            backdrop: 'static', 
            keyboard: false,
            size: 'sm',
            windowClass: 'center-modal'
        });
	}
	
	
	$scope.logout = function(){
		$scope.authenticate = false;
		$state.reload();
		$state.go("SprintDetails");
	}
}]);

//------------------------------------login.html controller---------------------------------------------------
controller.controller('loginController',['$state', '$http', '$scope', '$modalInstance', '$location', '$rootScope', '$q', function($state, $http, $scope, $modalInstance, $location, $rootScope, $q){
	
	
	project = [];
	var temp = [];
	
	var matched = false;
	$scope.loggedin = true;
	$scope.submitForm = function(username, password){
		$scope.users = {};
		$scope.users.username = username;
		$scope.users.password = password;
		$scope.loading = true;
		$http.post(urlBase+'/validate/user', $scope.users)
		.success(function(data){
			$scope.ldapUser = data;
			if($scope.ldapUser.sAMAccountName == username.toLowerCase()){
				$rootScope.$emit('authenticate', true);
				$rootScope.$emit('userName', username);
				for(var i in $scope.ldapUser.memberOf){
					project.push($scope.ldapUser.memberOf[i].split(','));
				}
				for(var j in project){
					temp = project[j];
					for(var k in temp){
						var subtemp = temp[k];
						temp[k] = subtemp.substring(3);
					}
					project[j] = temp;
					temp = [];
				}
				$modalInstance.close();
				matched = true;
			}
			if(matched == false){
				$scope.loggedin = false;
				$scope.username = '';
				$scope.password = '';
			}
			$scope.loading = false;
		})
		.error(function(data){
			$scope.loading = false;
			alert('post error');
		});
	}
	
	$scope.cancelForm = function(){
		$modalInstance.dismiss();
	}
	
}]);


//---------------------------------sprint.html controller---------------------------
controller.controller('sprint', ['$scope', '$state', '$modal', '$location', '$http', 'graphService', 'Tab1Name', 'Tab3Name', '$http', '$rootScope', 'urlName','$q', function($scope, $state, $modal, $location, $http, graphService, Tab1Name, Tab3Name, $http, $rootScope, urlName, $q){
	
	urlName.getUrl().then(function(response){
		 urlBase = response.data.url;
	 });
	
	$scope.name = Tab1Name.name;
	$scope.name3 = Tab3Name.name;
	
	$rootScope.$on('authenticate', function(event, flag){
		$scope.authenticate = flag;
	});
	
	
	$scope.authorization = function(index){
		if($scope.authenticate == true){
			for(var i in project){
				for(var j in project){
					if(project[i][j] == admin1 || project[i][j] == admin2){
						$scope.authorized = true;
						return true;
					}
				}
			}
		}
		else
			return false;
	}
	
	$scope.sprintbtn = function () {
        $modal.open({
            templateUrl: 'resources/views/NewSprint.html',
            controller: 'SprintController',
            backdrop: 'static',
            keyboard: false
        });
    }
	
	$scope.sprints  =[];

	var getEveryThing = function(){
		var getProject = $http({
			method: 'GET',
			url: urlBase+'/project'
		});
		
		var getGraphInSprint = $http({
			method: 'GET',
			url: urlBase+'/graphSprint'
		});
		
		var getSprint = $http({
			method: 'GET',
			url: urlBase+'/sprintDetails'
		});
		
		return $q.all([getProject, getGraphInSprint, getSprint]);
	}
	
	getEveryThing().then(function(data){
		$scope.project = data[0].data;
		$scope.graphInSprint = data[1].data;
		$scope.sprints = data[2].data;
		
		
		var convertor = function (s) {
	      	  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	      	  var d = new Date(s);
	      	  var da = d.getDate();
	      	  var suffix;
	      	  if(da == 1 || da == 21 || da == 31)
	      		  suffix = 'st';
	      	  else if(da == 2 || da == 22)
	      		  suffix = 'nd';
	      	  else if(da == 3 || da == 23)
	      		  suffix = 'rd';
	      	  else
	      		  suffix = 'th';
	      	  
	      	  return d.getDate() + suffix + ' ' + months[d.getMonth()] + ',' + d.getFullYear();
		}
		for(var i in $scope.sprints){
			$scope.date = convertor($scope.sprints[i].meeting_date);
			$scope.sprints[i].date = $scope.date;
		}
			
		$scope.eventLogObjects = {};
		$scope.eventLogObjects.pageSize = 3;
		$scope.eventLogObjects.currentPageIndex = 0;
      
		var projects;
		var graphsPerProject;
		for(var i in $scope.sprints){		
			projects = [];
			$scope.sprints[i].Project = [];
			$scope.sprints[i].noOfRed = 0;
			$scope.sprints[i].noOfYellow = 0;
			$scope.sprints[i].noOfGreen = 0;
			$scope.sprints[i].greenProjects = [];
			$scope.sprints[i].redProjects = [];
			$scope.sprints[i].yellowProjects = [];
			$scope.sprints[i].redproject = '';
			$scope.sprints[i].greenproject = '';
			$scope.sprints[i].yellowproject = '';
			
			var s_id = $scope.sprints[i].s_id;
			for(var j in $scope.project){
				graphsPerProject = [];
				graphsPerProject.p_name = $scope.project[j].p_name;
				for(var k in $scope.graphInSprint){
					if(s_id == $scope.graphInSprint[k].s_id && $scope.project[j].p_id == $scope.graphInSprint[k].p_id){
						graphsPerProject.push($scope.graphInSprint[k]);
						graphsPerProject.p_name = $scope.project[j].p_name; 
					}
				}
				projects.push(graphsPerProject);
			}
			$scope.sprints[i].Project.push(projects);
		}
		
		for(var i in $scope.sprints){
			for(var j in $scope.sprints[i].Project[0]){
				var Graph = $scope.sprints[i].Project[0][j];
				var projectName = $scope.sprints[i].Project[0][j].p_name;
				var percent = 0;
		        var count = 0;
		        var total = 0;
		        var nullvalues = 0;
		        var nacount = 0;
		        
		        for (k in Graph) {
		            if (Graph[k].color === 'green') {
		                count++;
		            }
		            if(Graph[k].inputvalue != null && Graph[k].na == false){
		        		total++;
		        	}
		            if(Graph[k].inputvalue == null && Graph[k].na == false){
		        		nullvalues++;
		        	}
		        	if(Graph[k].na == true){
		        		nacount++;
		        	}
		        }
		        percent = count / total * 100;
	        	
		        if(nullvalues == Graph.length){  // data not provided
		        	$scope.sprints[i].noOfRed = $scope.sprints[i].noOfRed + 1;
					$scope.sprints[i].redProjects.push(projectName);
					$scope.sprints[i].redproject = $scope.sprints[i].redProjects.toString(); 
		        }
		        else{
		        	if(nacount == Graph.length){    // if all graphs are NA
						
		        	}
		        	else{
		        		if(percent == 100){
							$scope.sprints[i].noOfGreen = $scope.sprints[i].noOfGreen + 1;
							$scope.sprints[i].greenProjects.push(projectName);
							$scope.sprints[i].greenproject = $scope.sprints[i].greenProjects.toString();
						}
						else if (percent >=60 && percent < 100) {
							$scope.sprints[i].noOfYellow = $scope.sprints[i].noOfYellow + 1;
							$scope.sprints[i].yellowProjects.push(projectName);
							$scope.sprints[i].yellowproject = $scope.sprints[i].yellowProjects.toString();
						}
						else {
							$scope.sprints[i].noOfRed = $scope.sprints[i].noOfRed + 1;
							$scope.sprints[i].redProjects.push(projectName);
							$scope.sprints[i].redproject = $scope.sprints[i].redProjects.toString(); 
						}
		        	}
		        }
	      	}
		}
		
	});
	$scope.dashresult = function (id) {
		 	graphService.set(id);
	        $modal.open({
	            templateUrl: 'resources/views/dashresult.html',
	            controller: 'dashresultController',
	            size: 'lg',
	            backdrop: 'static'
	        });
	    }
	
    $scope.projectInSprint = function (id){
        $location.path('/projectInSprint/' + id);
        $scope.linkValue = $scope.authenticate;
        if($scope.linkValue == true){
        	return true;
        }
        else
        	return false;
    }
    
    $scope.editSprint = function(id){
    	graphService.set(id);
        $modal.open({
            templateUrl: 'resources/views/editSprint.html',
            controller: 'editSprintController',
            backdrop: 'static',
            keyboard: false
        });
    }
    $scope.deleteSprint = function(s_id){
    	if(confirm("Are you sure you want to delete this Fiscal Week entry?" +
    			" Please note that all the project metrics data for this Fiscal Week will also be deleted.") == true){
    		
    		$http({
        		method: 'delete',
        		url: urlBase+'/sprints/delete/'+s_id
        	})
        	.success(function(data){
        		$state.reload();
        	})
        	.error(function(data){
        		alert('error');
        	});
        }
    }
}]);

//-----------------------------------project.html controller-------------------------------------
controller.controller('projectController',['$scope', '$state', '$http', '$modal', '$q', 'Tab2Name', 'Tab3Name', 'graphService', '$rootScope', 'urlName', function($scope, $state, $http, $modal, $q, Tab2Name, Tab3Name, graphService, $rootScope, urlName){
	
	$scope.name = Tab2Name.name;
	$scope.name3 = Tab3Name.name;
	
	urlName.getUrl().then(function(response){
		 urlBase = response.data.url;
	 });
	
	$rootScope.$on('authenticate', function(event, flag){
		$scope.authenticate = flag;
	});
	$scope.authorization = function(index){
		if($scope.authenticate == true){
			for(var i in project){
				for(var j in project){
					if(project[i][j] == admin1 || project[i][j] == admin2){
						$scope.authorized = true;
						return true;
					}
				}
			}
		}
		else
			return false;
	}
	
	$scope.addproject = function () {
        $modal.open({
            templateUrl: 'resources/views/NewProject.html',
            controller: 'NewProjectController',
            backdrop: 'static',
            keyboard: false
        });
    }
	
	
	
	$scope.editGraphInProject = function(id){
		graphService.set(id);
		$modal.open({
			templateUrl: 'resources/views/editGraphInProject.html',
			controller: 'editGraphInProjectController',
			backdrop: 'static',
	        keyboard: false
		});
	}
	
	$scope.project = [];
	$http.get(urlBase+'/project')
	.success(function(data){
		$scope.project = data;
		$http.get(urlBase+'/graphInProject')
			.success(function(data){
				$scope.projectsGraph = data;
				for (var i in $scope.project){
					$scope.project[i].Graph = [];
					for (var j in $scope.projectsGraph){
						if($scope.project[i].p_id == $scope.projectsGraph[j].p_id){
							$scope.project[i].Graph.push($scope.projectsGraph[j]);
						}
					}
				}	
			})
			.error(function(data){
				alert('inner page error');
			});
	})
	.error(function(data){
		alert("error");
	});
	
	 $scope.deleteProject = function(p_id){
		 if(confirm("Are you sure you want to delete this Project entry?" +
			" Please note that all the Quality metrics data for this Project will also be deleted.") == true){
			 $http({
		    		method: 'delete',
		    		url: urlBase+'/projects/delete/'+p_id
		    	})
		    	.success(function(data){
		    		$state.reload();
		    	})
		    	.error(function(data){
		    		alert('error');
		    	});
		 }
	  }
	 
	 $scope.ViewTrends = function(p_id){
		 
		 $http.get(urlBase+'/graphSprint/'+p_id)
		.success(function(data){
			$scope.graphSprint = data;
			graphService.setArray($scope.graphSprint);
		})
		.error(function(data){
			alert('error');
		});
		 
		 graphService.set(p_id);
		 $modal.open({
				templateUrl: 'resources/views/viewTrends.html',
				controller: 'viewTrendsController',
				size: 'lg',
				backdrop: 'static',
		        keyboard: false
			});
	 }
}]);

//---------------------------------------graph.html controller------------------------------------
controller.controller('graphController',['$scope', '$state', '$http', '$modal', 'graphService', 'Tab3Name', '$rootScope', 'urlName', function($scope, $state, $http, $modal, graphService, Tab3Name, $rootScope, urlName){
	
	$scope.name3 = Tab3Name.name;
	
	urlName.getUrl().then(function(response){
		 urlBase = response.data.url;
	 });
	
	$rootScope.$on('authenticate', function(event, flag){
		$scope.authenticate = flag;
	});
	$scope.authorization = function(index){
		if($scope.authenticate == true){
			for(var i in project){
				for(var j in project){
					if(project[i][j] == admin1 || project[i][j] == admin2){
						$scope.authorized = true;
						return true;
					}
				}
			}
		}
		else
			return false;
	}
	
	$scope.addgraph = function (){
		$modal.open({
			templateUrl: 'resources/views/NewGraph.html',
			controller: 'NewGraphController',
			backdrop: 'static',
	        keyboard: false
		});
	}
	
	$http.get(urlBase+'/graphs')
	.success(function(data){
		$scope.graph = data;
	})
	.error(function(data){
		alert("error");
	});
	
	$scope.edit = function(id){
		graphService.set(id);
		$modal.open({
			templateUrl: 'resources/views/editGraph.html',
			controller: 'editGraphController',
			backdrop: 'static',
	        keyboard: false
		});
	}
	
	 $scope.deleteGraph = function(g_id){
		 if(confirm("Are you sure you want to delete this Quality Metrics entry?" +
			" Please note that this Quality Metrics will not be visible henceforth in all Projects.") == true){
			 $http({
		    		method: 'delete',
		    		url: urlBase+'/graphs/delete/'+g_id
		    	})
		    	.success(function(data){
		    		$state.reload();
		    	})
		    	.error(function(data){
		    		alert('error');
		    	});
		 }
	 }
}])

//-----------------------------------projectInSprint.html controller-----------------------------
controller.controller('projectInSprintController',['$scope', '$http', '$stateParams', '$modal', 'graphService', 'Tab3Name', '$rootScope', function ($scope, $http, $stateParams, $modal, graphService, Tab3Name, $rootScope) {
	
$scope.name3 = Tab3Name.name;
	
	
	$http.get(urlBase+'/project')
	.success(function(data){
		$scope.projectInSprint = data;
		
		$scope.authorization = function(index){
			if($scope.authenticate == true){
				for(var i in project){
					for(var j in project){
						if(project[i][j] == admin1 || project[i][j] == $scope.projectInSprint[index].qms_name || project[i][j] == admin2){
							return true;
						}
					}
				}
			}
			else
				return false;
		}
	});
	
	$rootScope.$on('authenticate', function(event, flag){
		$scope.authenticate = flag;
	});
	
	
	
	$scope.addGraph = function(id){
		graphService.set(id);
		$modal.open({
			templateUrl: 'resources/views/addGraph.html',
			controller: 'addGraphController',
			backdrop: 'static',
	        keyboard: false
		});
	}
	
	$scope.viewGraph = function(id){
		graphService.set(id);
		$modal.open({
			templateUrl: 'resources/views/viewGraph.html',
			controller: 'viewGraphController',
			size:'lg',
			backdrop: 'static',
	        keyboard: false
		});
	}
	
	$scope.ViewTrends = function(p_id){
		 
		 $http.get(urlBase+'/graphSprint/'+p_id)
		.success(function(data){
			$scope.graphSprint = data;
			graphService.setArray($scope.graphSprint);
		})
		.error(function(data){
			alert('error');
		});
		 
		 graphService.set(p_id);
		 $modal.open({
				templateUrl: 'resources/views/viewTrends.html',
				controller: 'viewTrendsController',
				size: 'lg',
				backdrop: 'static',
		        keyboard: false
			});
	 }
	
}]);

//------------------------------viewTrends.html controller---------------------------------------------------
controller.controller('viewTrendsController',['$scope', '$http', '$modalInstance', '$state', 'graphService', 'Tab3Name', function($scope, $http, $modalInstance, $state, graphService, Tab3Name){

	var p_id = graphService.get();
	var chartArray = [];
	$scope.name3 = Tab3Name.name;
	$scope.graphInProject = [];
	var inputvalue = [];
	var chart = {};
	var color = '';
	var negativecolor = '';
	var value;
	var goal = [];
	var validinput = 0;
	var transparent = '';
	var date = [];
	$http.get(urlBase+'/project')
	.success(function(data){
		$scope.project = data;
		chartArray = graphService.getArray();
		
		for(var j in $scope.project){
			if(p_id == $scope.project[j].p_id){
				$scope.projectName = $scope.project[j].p_name;
			}
		}
		$http.get(urlBase+'/sprintDetails')
		.success(function(data){
			$scope.sprintDetails = data;
			var s_id = $scope.sprintDetails[0].s_id;
			
			$http.get(urlBase+'/graphSprint')
			.success(function(data){
				$scope.graphSprint = data;
				
				$http.get(urlBase+'/graphInProject')
				.success(function(data){
					$scope.projectsGraph = data;
					for (var j in $scope.projectsGraph){
						if(p_id == $scope.projectsGraph[j].p_id){
							$scope.graphInProject.push($scope.projectsGraph[j]);
						}
					}
					var convertor = function (s) {
				      	  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
				      	  var d = new Date(s);
				      	  var da = d.getDate();
				      	  var suffix;
				      	  if(da == 1 || da == 21 || da == 31)
				      		  suffix = 'st';
				      	  else if(da == 2 || da == 22)
				      		  suffix = 'nd';
				      	  else if(da == 3 || da == 23)
				      		  suffix = 'rd';
				      	  else
				      		  suffix = 'th';
				      	  
				      	  return d.getDate() + suffix + ' ' + months[d.getMonth()] + ',' + d.getFullYear();
					}
					var len = $scope.sprintDetails.length ; 
					for(var a=len-1; a>=0; a--){
						var temp = convertor($scope.sprintDetails[a].meeting_date);
						date.push(temp);
					}
					for(var x in $scope.graphInProject){
						for(var z in chartArray){
							if($scope.graphInProject[x].graph_name === chartArray[z].g_name){
								inputvalue.push(parseInt(chartArray[z].inputvalue));
								switch($scope.graphInProject[x].options){
								case '<=': 	$scope.graphInProject[x].validinput = $scope.graphInProject[x].validinput + 0.01;
										   	color = 'red';
										   	negativecolor = 'green';
										   	break;
								case '<': 	color = 'red';
										   	negativecolor = 'green';
										   	break;
								case '>=':  color = 'green';
											negativecolor = 'red';
											break;
								case '>':	$scope.graphInProject[x].validinput = $scope.graphInProject[x].validinput + 0.01;
											color = 'green';
											negativecolor = 'red';
											break;
								case '=':	color = 'green';
											negativecolor = 'red';
											transparent = 'transparent';
											break;
									
								case '+':	validinput = parseInt($scope.graphInProject[x].validinput);
											
											if(chartArray[z].s_id == 1){
												value = 0;
												goal.push(parseInt(value) + validinput + 0.01);
											}
											else{
												for(var v in $scope.graphSprint){
													if($scope.graphSprint[v].s_id == chartArray[z].s_id-1){
														if($scope.graphSprint[v].p_id == p_id){
															if($scope.graphSprint[v].g_name === chartArray[z].g_name && $scope.graphSprint[v].inputvalue !== null){
																value = $scope.graphSprint[v].inputvalue;
																goal.push(parseInt(value) + validinput + 0.01);
																break;
															}
														}
													}
												}
											}
											if(value != null){
												break;	
											}
								}
							}
						}
						if($scope.graphInProject[x].options === '+'){
							$scope.graphInProject[x].series = chartsForPlus($scope.graphInProject[x].graph_name, inputvalue, goal, date);
						}
						else if($scope.graphInProject[x].options === '='){
							$scope.graphInProject[x].series = chartsForEqual($scope.graphInProject[x].graph_name, inputvalue, color, negativecolor, transparent, $scope.graphInProject[x].validinput, date);
						}
						else{
							$scope.graphInProject[x].series = charts($scope.graphInProject[x].graph_name, inputvalue, color, negativecolor, $scope.graphInProject[x].validinput, date);
						}
						inputvalue = [];
					}	
				})
				.error(function(data){
					alert('get graphInProject error');
				});
			})
			.error(function(data){
				alert('get graphSprint error');
			});
		})
		.error(function(data){
			alert('get sprintDetails error');
		});
	})
	.error(function(data){
		alert('get project error');
	});
	
	var charts = function(name, value, colors, negativecolors, validinput, date){
		var chartdata = {
				yAxis: {
					allowDecimals : false,
			        lineWidth:1,
			        min:0,
		            title: {
		                text: 'Values'
		            },
		            plotLines: [{
		                value: validinput,
		                color: '#808080',
		                dashStyle : 'line',
	                    width : 2,
		            }]
		        },
		        xAxis : {
		        	categories :  date
		        },
		        plotOptions: {
		            series: {
		                connectNulls: true   
		            }
		        },
				legend: {
			        enabled: false
			    },
			    credits: {
			    	enabled: false
			    },
				series: [{
					type: 'line',
					threshold : validinput - 0.01,
					color: colors,
			        negativeColor: negativecolors,
		            data: value
		        }],
		        title : {
		        	text: name
		        }
		}
		return chartdata;
	}
	var chartsForEqual = function(name, value, colors, negativecolors, transparents, validinput, date){
		var valminus = validinput - 0.01;
		var valplus = validinput + 0.01;
		var serlength = 2;
		var temp = {};
		var chartdata = {
				yAxis: {
					allowDecimals : false,
			        lineWidth:1,
			        min:0,
		            title: {
		                text: 'Values'
		            },
		            gridLineColor: 'transparent',
		            plotLines: [{
		            	value: validinput,
		                color: '#808080',
		                dashStyle : 'line',
	                    width : 2,
		            }]
		        },
		        xAxis : {
		        	categories :  date
		        },
		        plotOptions: {
		            series: {
		                connectNulls: true   
		            }
		        },
				legend: {
			        enabled: false
			    },
			    credits: {
			    	enabled: false
			    },
			    series: [{
			    	type: 'line',
					threshold : valminus,
					color: 'green',
			        negativeColor: 'red',
		            data: value
        },
        {
			        type: 'line',
					threshold : valplus,
					color: 'red',
			        negativeColor: 'transparent',
			        data: value
                 }],
		        title : {
		        	text: name
		        }
		}
		return chartdata;
	}
	var chartsForPlus = function(name, value, goal, date){
		var temp = {};
		var tempplot = {};
		var chartdata = {
			legend: {
		        enabled: false
		    },
		    chart : {
		    	type: 'line'
		    },	
		    credits: {
		    	enabled: false
		    },
		    yAxis: {
		    	allowDecimals : false,
		        lineWidth:1,
		        min:0,
	            title: {
	                text: 'Values'
	            },
	            plotLines: []
	        },
	        xAxis : {
	        	categories :  date
	        },
	        plotOptions: {
	            series: {
	                connectNulls: true   
	            }
	        },
			series:[],
			title : {
	        	text: name
	        }
		}
		for(var a in goal){
			temp.threshold = goal[a];
			temp.type = 'line';
			temp.data = value;
			temp.color = 'green';
			if(a == 0){
				temp.negativeColor = 'red';
			}
			else{
				temp.negativeColor = 'transparent';
			}
			chartdata.series.push(temp);
			temp = {};
			
			tempplot.value = goal[a];
			tempplot.color = '#808080';
			tempplot.dashStyle = 'line';
            tempplot.width = 2;
            
            chartdata.yAxis.plotLines.push(tempplot);
            tempplot = {};
		}
		return chartdata;
	}
	
	$scope.ok = function(){
		$modalInstance.dismiss();
	};
	
}]);


//-------------------------------NewSprint.html controller----------------------
controller.controller('SprintController',['$scope', '$http', '$modalInstance', '$state', 'graphService', 'Tab1Name', function($scope, $http, $modalInstance, $state, graphService, Tab1Name){

	$scope.name = Tab1Name.name;
	
	var keyPress = false;
	var backspace = false;
    $scope.change = function($event){
    	keyPress = true;
    }
    $scope.getValue = function(event){
    	if(event.keyCode === 8){
    		backspace = true;
    	}
    }
    $scope.cancelForm = function () {
    	if(keyPress === true || backspace === true){
    		if(confirm("Are you sure you want to discard the changes") == true){
            	$modalInstance.dismiss();
            }
    	}
    	else{
    		$modalInstance.dismiss();
    	}
    }
	
	$scope.clear = function () {
        $scope.dts = null;
        $scope.dte = null;
    };

    // Disable weekend selection
    $scope.disabled = function (date, mode) {
        return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
    };

    $scope.opens = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.openstart = true;
        $scope.openend = false;
    };

    $scope.opene = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.openstart = false;
        $scope.openend = true;
    };
    
    $scope.EditableSprintDash = {};
    $scope.saveForm = function () {
        $modalInstance.close();
        var datenormal = function (str) {

            var date = new Date(str),
                mnth = ("0" + (date.getMonth() + 1)).slice(-2),
                day = ("0" + date.getDate()).slice(-2);
            return [date.getFullYear(), mnth, day].join("-");

        };
        
        var meetingDate = datenormal($scope.EditableSprintDash.meeting_date);
        $scope.EditableSprintDash.s_date = meetingDate;
        
        var s_id = graphService.get()
        $http.post(urlBase+'/sprints/insert', $scope.EditableSprintDash)
        .success(function(data){
        	$scope.sprint = data;
        	$state.reload();  
        	var s_id = $scope.sprint[0].s_id;
        	
        	$http.post(urlBase+'/graph/assignNullValue/'+s_id)
        	.success(function(data){
        		console.log("assigned null value");
        	})
        	.error(function(data){
        		alert("assign null value error");
        	});
        })
        .error(function(data){
        	alert("error");
        });
        $scope.EditableSprintDash = {};
    };
    
}]);

//------------------------------editSprint.html Controller-------------------------------------------
controller.controller('editSprintController',['$scope', '$http', '$modalInstance', '$state', 'graphService', 'Tab1Name', function($scope, $http, $modalInstance, $state, graphService, Tab1Name){
	
	var s_id = graphService.get();
	$scope.name = Tab1Name.name;
	
	var keyPress = false;
	var backspace = false;
    $scope.change = function($event){
    	keyPress = true;
    }
    $scope.getValue = function(event){
    	if(event.keyCode === 8){
    		backspace = true;
    	}
    }
    $scope.cancelForm = function () {
    	if(keyPress === true || backspace === true){
    		if(confirm("Are you sure you want to discard the changes") == true){
            	$modalInstance.dismiss();
            }
    	}
    	else{
    		$modalInstance.dismiss();
    	}
    }
    
    $scope.disabled = function (date, mode) {
        return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
    };

    $scope.opens = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.openstart = true;
        $scope.openend = false;
    };

    $scope.opene = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.openstart = false;
        $scope.openend = true;
    };
    
    $scope.EditableSprintDash = {};
    
    $http.get(urlBase+'/sprintDetails')
    .success(function(data){
    	$scope.sprint = data;
    	for(var i in $scope.sprint){
    		if($scope.sprint[i].s_id == s_id){
    			$scope.EditableSprintDash.s_name = $scope.sprint[i].s_name;
    			$scope.EditableSprintDash.meeting_date = $scope.sprint[i].meeting_date;
    			$scope.EditableSprintDash.s_id = $scope.sprint[i].s_id;
    		}
    	}
    })
    .error(function(data){
    	alert('get error');
    });
    
    
    $scope.saveForm = function () {
        $modalInstance.close();
        var datenormal = function (str) {

            var date = new Date(str),
                mnth = ("0" + (date.getMonth() + 1)).slice(-2),
                day = ("0" + date.getDate()).slice(-2);
            return [date.getFullYear(), mnth, day].join("-");

        };
        
        var meetingDate = datenormal($scope.EditableSprintDash.meeting_date);
        $scope.EditableSprintDash.meeting_date = meetingDate;
        
        $http.put(urlBase+'/sprints/update/'+s_id, $scope.EditableSprintDash)
        .success(function(data){
        	$scope.sprint = data;
        	$state.reload();
        })
        .error(function(data){
        	alert("error");
        }); 
        $scope.EditableSprintDash = {};      
    };
}]);

//------------------------------NewProject.html controller------------------------------
controller.controller('NewProjectController',['$scope', '$http', '$modalInstance', '$state', '$q', 'Tab2Name', '$modal', 'graphService', '$rootScope', function($scope, $http, $modalInstance, $state, $q, Tab2Name, $modal, graphService, $rootScope){
	
	$scope.name = Tab2Name.name;
	
	var keyPress = false;
	var backspace = false;
    $scope.change = function($event){
    	keyPress = true;
    }
    $scope.getValue = function(event){
    	if(event.keyCode === 8){
    		backspace = true;
    	}
    }
    $scope.cancelForm = function () {
    	if(keyPress === true || backspace === true){
    		if(confirm("Are you sure you want to discard the changes") == true){
            	$modalInstance.dismiss();
            }
    	}
    	else{
    		$modalInstance.dismiss();
    	}
    }
    
    $scope.options = ['<', '<=', '>', '>=', '=', '+'];
	
	$scope.EditableProjectDash = {};
	var tempValue = [];
	var tempString = '';
	$scope.project = [];
	$scope.EditableGraphInProject = [];
	$scope.graph = [];
	
	$http.get(urlBase+'/graphs')
	.success(function(data){
		$scope.graph =data;
		for (var i in $scope.graph){
			$scope.graph[i].options = '';
			$scope.graph[i].validinput = '';
		}
	})
	.error(function(data){
		alert('error');
	});
	
	$scope.checkName = function(name){
		
		var nameToCheck = [];
		name = name.replace(/ /g,'');
		nameToCheck.push(name.split(','));
		var length = nameToCheck[0].length;
		var latestName = nameToCheck[0][length-1];
		$scope.ldapUser = {};
		$scope.ldapUser.firstName = latestName;
		$http.post(urlBase+'/getMatching/user', $scope.ldapUser)
		.success(function(data){
			$scope.allMatchingUser = data;
			for(var i in $scope.allMatchingUser){
				$scope.allMatchingUser[i].id = i;
				$scope.allMatchingUser[i].checkName = false;
			}
			graphService.setArray($scope.allMatchingUser);
			$modal.open({
				templateUrl: 'resources/views/viewMatchingUsers.html',
				controller: 'viewMatchingUsers',
				size: 'sm'
			});
		})
		.error(function(data){
			alert('getMatchingUser error');
		});
	}
	$rootScope.$on('selectedName', function(event, flag){
		tempValue.push(flag);
		tempString = tempValue.join(', ');
		$scope.EditableProjectDash.tl = tempString;
	});
	
	$scope.saveForm = function () {
        $modalInstance.close();
        
        for(var i in $scope.graph){
        	$scope.graph[i].validRange = $scope.graph[i].options + $scope.graph[i].validinput;
        	if($scope.graph[i].graph_checked == true){
        		$scope.EditableGraphInProject.push($scope.graph[i]);
        	}
        	for(var j in $scope.EditableGraphInProject){
        		if($scope.EditableGraphInProject[j].graph_id == $scope.graph[i].graph_id){
        			$scope.EditableGraphInProject[j].options = $scope.graph[i].options;
        			$scope.EditableGraphInProject[j].validinput = $scope.graph[i].validinput;
        		}
        	}
        }
   
        $http.post(urlBase+'/projects/insert', $scope.EditableProjectDash).success(function(data){
        	$scope.project = data;
        	var k = 0;
        	for (var j in $scope.project){
        		++k;
        	}
        	for(var i in $scope.EditableGraphInProject){
        		$scope.EditableGraphInProject[i].p_id = $scope.project[k-1].p_id;
        	}
	       	$http.post(urlBase+'/graphProject/insert', $scope.EditableGraphInProject).success(function(data){
	        		$scope.graphInProject = data;
	        		$state.reload();
	        	}).error(function(data){alert('inner error');});
	       	$state.reload();
	        }).error(function(data){alert('error');});
        
	        $scope.EditableProjectDash = {};
    	};
        
}]);


//--------------------------------viewMatchingUsers.html controller------------------------------
controller.controller('viewMatchingUsers', ['$scope', 'graphService', '$modalInstance', '$rootScope', function($scope, graphService, $modalInstance, $rootScope){
	$scope.allMatchingName = graphService.getArray();
	$scope.checkName = false;
	$scope.setSelected = function(index){
		$scope.selectedValue = $scope.allMatchingName[index].givenName;
	}
	$scope.saveForm = function(){
		$rootScope.$emit('selectedName', $scope.selectedValue);
		$modalInstance.close();
	}
	
}]);

//---------------------------------editGraphInProject.html Controller---------------------------------
controller.controller('editGraphInProjectController',['$scope', '$state', 'graphService', '$http', '$modalInstance', '$q', 'Tab2Name', 'Tab3Name', '$rootScope','$modal', function($scope, $state, graphService, $http, $modalInstance, $q, Tab2Name, Tab3Name, $rootScope, $modal){
	
	$scope.name = Tab2Name.name;
	$scope.name3 = Tab3Name.name;
	var p_id = graphService.get();
	var tempValue = [];
	var tempString = '';
	var nameCount = 1;
	var keyPress = false;
	var backspace = false;
	var tlname = '';
    $scope.change = function($event){
    	keyPress = true;
    }
    $scope.getValue = function(event){
    	if(event.keyCode === 8){
    		backspace = true;
    	}
    }
    $scope.cancelForm = function () {
    	if(keyPress === true || backspace === true){
    		if(confirm("Are you sure you want to discard the changes") == true){
            	$modalInstance.dismiss();
            }
    	}
    	else{
    		$modalInstance.dismiss();
    	}
    }
    
    $scope.options = ['<', '<=', '>', '>=', '=', '+'];
	
	$scope.EditableProjectDash = {};
	$scope.EditableUpdateGraphInProject = [];
	$scope.project = [];
	$scope.EditableGraphInProject = [];
	$scope.graph = [];
    var update = false;
	
	var getProjectAndGraphInProject = function(){
		var getProject = $http({
			method: 'GET',
			url: urlBase+'/project'
		});
		
		var graph = $http({
			method: 'GET',
			url: urlBase+'/graphs'
		});
		
		var getGraphProject = $http({
			method: 'GET',
			url: urlBase+'/graphProject'
		})
		
		return $q.all([getProject, graph, getGraphProject]);
		
	}
	
	getProjectAndGraphInProject().then(function(data){
		$scope.project = data[0].data;
		$scope.graph = data[1].data;	
		$scope.graphProject = data[2].data;
		
		for(var i in $scope.project){
			if(p_id == $scope.project[i].p_id){
				$scope.EditableProjectDash.p_name = $scope.project[i].p_name;
				$scope.EditableProjectDash.tl = $scope.project[i].tl;
				$scope.EditableProjectDash.qms_name = $scope.project[i].qms_name;
				$scope.projectName = $scope.project[i].p_name;
			}
		}
		var graph_id;
		for(var j in $scope.graph){
			$scope.graph[j].options = '';
			$scope.graph[j].validinput ='';
			for(var k in $scope.graphProject){
				if($scope.graph[j].graph_id == $scope.graphProject[k].graph_id && p_id == $scope.graphProject[k].p_id){
					$scope.graph[j].graph_checked = true;
					$scope.graph[j].options = $scope.graphProject[k].options;
					$scope.graph[j].validinput = $scope.graphProject[k].validinput;
				}
			}
		}
		
	});
	$rootScope.$on('selectedName', function(event, flag){
		for(var i in $scope.project){
			if(p_id == $scope.project[i].p_id){
				tlname = $scope.project[i].tl;
			}
		}
		if(nameCount == 1){
			tempValue.push(tlname);
		}
		tempValue.push(flag);
		tempString = tempValue.join(', ');
		$scope.EditableProjectDash.tl = tempString;
		nameCount++;
	});
	$scope.checkName = function(name){	
		var nameToCheck = [];
		name = name.replace(/ /g,'');
		nameToCheck.push(name.split(','));
		var length = nameToCheck[0].length;
		var latestName = nameToCheck[0][length-1];
		$scope.ldapUser = {};
		$scope.ldapUser.firstName = latestName;
		$http.post(urlBase+'/getMatching/user', $scope.ldapUser)
		.success(function(data){
			$scope.allMatchingUser = data;
			for(var i in $scope.allMatchingUser){
				$scope.allMatchingUser[i].id = i;
				$scope.allMatchingUser[i].checkName = false;
			}
			graphService.setArray($scope.allMatchingUser);
			$modal.open({
				templateUrl: 'resources/views/viewMatchingUsers.html',
				controller: 'viewMatchingUsers',
				size: 'sm'
			});
		})
		.error(function(data){
			alert('getMatchingUser error');
		});
	}
	var insert = true;
	$scope.saveForm = function(){
		$modalInstance.close();
		for (var j in $scope.graph){
			if($scope.graph[j].graph_checked == false && $scope.graph[j].options !== '' && $scope.graph[j].validinput !== ''){
				graph_id = $scope.graph[j].graph_id;
				$http({
		    		method: 'delete',
		    		url: urlBase+'/graphProjects/delete/'+p_id+'/'+graph_id
		    	})
		    	.success(function(data){
		    		$state.reload();
		    	})
		    	.error(function(data){
		    		alert('error');
		    	});
			}
		}
		
		for(var i in $scope.graph){
			for(var j in $scope.graphProject){
				$scope.graph[i].validRange = $scope.graph[i].options + $scope.graph[i].validinput;
				if($scope.graph[i].graph_checked == true && $scope.graph[i].graph_id == $scope.graphProject[j].graph_id && $scope.graphProject[j].p_id == p_id){
					$scope.EditableUpdateGraphInProject.push($scope.graph[i]);
					update = true;
				}
			}
		}
		
		for(var i in $scope.graph){
			insert = true;
			for(var k in $scope.EditableUpdateGraphInProject){
				if($scope.EditableUpdateGraphInProject[k].graph_id == $scope.graph[i].graph_id){
					insert = false;
				}
			}
			if($scope.graph[i].graph_checked == true && insert == true){
				$scope.EditableGraphInProject.push($scope.graph[i]);
			}
		}
		for(var k in $scope.EditableGraphInProject){
    		$scope.EditableGraphInProject[k].p_id = p_id;
		}
		for(var k in $scope.EditableUpdateGraphInProject){
			$scope.EditableUpdateGraphInProject[k].p_id = p_id;
		}
		$http.put(urlBase+'/projects/update/'+p_id, $scope.EditableProjectDash)
		.success(function(data){
			$scope.project = data;
			$http.post(urlBase+'/graphProject/insert', $scope.EditableGraphInProject)
			.success(function(data){
        		$scope.graphInProject = data;
        		$state.reload();
        	})
        	.error(function(data){
        		alert('inner error');
        	});
			$http.put(urlBase+'/graphProjects/update/'+p_id, $scope.EditableUpdateGraphInProject)
			.success(function(data){
				$scope.graphProject = data;
				$state.reload();
			})
			.error(function(data){
				alert('inner put error');
			});
			$state.reload();
		})
		.error(function(data){
			alert('outer put error');
		});
		
	}
}]);


//---------------------------------NewGraph.html controller--------------------------
controller.controller('NewGraphController',['$scope', '$http', '$modalInstance', '$state', 'Tab3Name', function($scope, $http, $modalInstance, $state, Tab3Name){
	
	$scope.name3 = Tab3Name.name;
	
	var keyPress = false;
	var backspace = false;
    $scope.change = function($event){
    	keyPress = true;
    }
    $scope.getValue = function(event){
    	if(event.keyCode === 8){
    		backspace = true;
    	}
    }
    $scope.cancelForm = function () {
    	if(keyPress === true || backspace === true){
    		if(confirm("Are you sure you want to discard the changes") == true){
            	$modalInstance.dismiss();
            }
    	}
    	else{
    		$modalInstance.dismiss();
    	}
    }
    
	$scope.EditableGraphDash = {};
	$scope.saveForm = function(){
		$modalInstance.close();
		
		$http.post(urlBase+'/graphs/insert', $scope.EditableGraphDash)
		.success(function(data){
			$scope.graph = data;
			$state.reload();
		})
		.error(function(data){
			alert('error');
		});
	};
    
}])

//---------------------------------addGraph.html controller----------------------------
controller.controller('addGraphController',['$scope', '$http', '$modalInstance', '$stateParams', 'graphService', 'Tab3Name', function($scope, $http, $modalInstance, $stateParams, graphService, Tab3Name){

	$scope.name3 = Tab3Name.name;
	
	var keyPress = false;
	var backspace = false;
    $scope.change = function($event){
    	keyPress = true;
    }
    $scope.getValue = function(event){
    	if(event.keyCode === 8){
    		backspace = true;
    	}
    }
    $scope.cancelForm = function () {
    	if(keyPress === true || backspace === true){
    		if(confirm("Are you sure you want to discard the changes") == true){
            	$modalInstance.dismiss();
            }
    	}
    	else{
    		$modalInstance.dismiss();
    	}
    }
	
	$scope.EditableGraphDash = [];
	$scope.EditableUpdateGraphDash = [];
	$scope.graphInSprint = [];
	var s_id = parseInt($stateParams.id);
	var p_id = graphService.get();
	var update = false;
	
	$http.get(urlBase+'/project')
	.success(function(data){
		$scope.project = data;
		for(var j in $scope.project){
			if(p_id == $scope.project[j].p_id){
				$scope.projectName = $scope.project[j].p_name;
			}
		}
		$http.get(urlBase+'/graphInSprint/'+ p_id)
		.success(function(data){
			$scope.graphInSprint = data;
			
			for(var i in $scope.graphInSprint){
				$scope.graphInSprint[i].s_id = s_id;
				$scope.graphInSprint[i].p_id = p_id;
				$scope.graphInSprint[i].color = '';
				$scope.graphInSprint[i].action_plan = '';
				$scope.graphInSprint[i].inputvalue = '';
				$scope.graphInSprint[i].na = false;
			}
			$http.get(urlBase+'/graphSprint')
			.success(function(data){
				$scope.graphSprint = data;
				for (var j in $scope.graphInSprint){
					for (var k in $scope.graphSprint){
						if($scope.graphInSprint[j].s_id == $scope.graphSprint[k].s_id && $scope.graphInSprint[j].p_id == $scope.graphSprint[k].p_id){
							if($scope.graphInSprint[j].graph_name == $scope.graphSprint[k].g_name){
								$scope.graphInSprint[j].color = $scope.graphSprint[k].color;
								$scope.graphInSprint[j].action_plan = $scope.graphSprint[k].action_plan;
								$scope.graphInSprint[j].inputvalue = $scope.graphSprint[k].inputvalue;
								$scope.graphInSprint[j].na = $scope.graphSprint[k].na;
							}
						}
					}
				}
			})
			.error(function(data){
				alert('innermost error');
			});
		})
		.error(function(data){
			alert('inner error');
		});
	})
	.error(function(data){
		alert('error');
	});
	
	$scope.getColor = function(inputvalue, validRange, graph_name, index){
		var option = validRange.charAt(0);
		var x;
		var expression;
		if(option == '+'){
			if(s_id == 1){
				x = 0;
			}
			else{
				for(var i = s_id; i > 0; i--){
					for(var j in $scope.graphSprint){
						if($scope.graphSprint[j].s_id == i-1){
							if($scope.graphSprint[j].p_id == p_id){
								if($scope.graphSprint[j].g_name == graph_name && $scope.graphSprint[j].inputvalue != null){
									x = $scope.graphSprint[j].inputvalue;
									break;
								}
							}
						}
					}
					if(x != null){
						break;
					}
				}
			}
			if(x == null){
				x = 0;
			}
			validRange = '>(' + x + validRange + ')';
			expression = inputvalue + validRange;
		}
		else if(option == '='){
			expression = inputvalue + '=' + validRange;
		}
		else{
			expression = inputvalue + validRange;
		}
		
		if($scope.$eval(expression)){
			$scope.graphInSprint[index].color = 'green';
			$scope.graphInSprint[index].action_plan = '';
		}
		else
			$scope.graphInSprint[index].color = 'red';
	};
	
	
	
	$scope.saveForm = function(){
		$modalInstance.close();
		for (var i in $scope.graphInSprint){
			$scope.graphInSprint[i].g_name = $scope.graphInSprint[i].graph_name;
			if($scope.graphInSprint[i].color == 'green'){
				$scope.graphInSprint[i].action_plan = '';
			}
		}
		for(var i in $scope.graphInSprint){
			for(var z in $scope.graphSprint){
				if($scope.graphSprint[z].s_id == s_id && $scope.graphSprint[z].p_id == p_id){
					if($scope.graphSprint[z].g_name == $scope.graphInSprint[i].graph_name){
						if ($scope.graphInSprint[i].na == true){
							if($scope.graphSprint[z].na == false){
								$scope.graphInSprint[i].color = '';
								$scope.graphInSprint[i].inputvalue = '';
							}
						}
					}
				}
			}
		}
		for (var i in $scope.graphInSprint){
			for(var z in $scope.graphSprint){
				if($scope.graphSprint[z].s_id == s_id && $scope.graphSprint[z].p_id == p_id){
					if($scope.graphSprint[z].g_name == $scope.graphInSprint[i].graph_name){
						$scope.EditableUpdateGraphDash.push($scope.graphInSprint[i]);
						update = true;
					}
				}
			}
		}
		for(var i in $scope.graphInSprint){
			var insert = true;
			for(var j in $scope.EditableUpdateGraphDash){
				if($scope.EditableUpdateGraphDash[j].graph_name == $scope.graphInSprint[i].graph_name){
					insert = false;
				}
			}
			if(insert == true){
				$scope.EditableGraphDash.push($scope.graphInSprint[i]);
			}
		}
		$http.post(urlBase+'/graphSprint/insert', $scope.EditableGraphDash)
		.success(function(data){
			$scope.graph = data;
		})
		.error(function(data){
			alert('post error');
		});
		$http.put(urlBase+'/graphSprint/update/'+s_id+'/'+p_id, $scope.EditableUpdateGraphDash)
		.success(function(data){
			$scope.graph = data;
		})
		.error(function(data){
			alert('put error');
		});
	}
}]);


//-------------------------------------editGraph.html Controller--------------------------------
controller.controller('editGraphController',['$scope', '$http', '$modalInstance', 'graphService', '$state', 'Tab3Name', function($scope, $http, $modalInstance, graphService, $state, Tab3Name){
	
	$scope.name3 = Tab3Name.name;
	
	var keyPress = false;
	var backspace = false;
    $scope.change = function($event){
    	keyPress = true;
    }
    $scope.getValue = function(event){
    	if(event.keyCode === 8){
    		backspace = true;
    	}
    }
    $scope.cancelForm = function () {
    	if(keyPress === true || backspace === true){
    		if(confirm("Are you sure you want to discard the changes") == true){
            	$modalInstance.dismiss();
            }
    	}
    	else{
    		$modalInstance.dismiss();
    	}
    }
    
	$scope.EditableGraphDash = {};
	var getid = graphService.get();
	$http.get(urlBase+'/graphs')
	.success(function(data){
		$scope.graph = data;
		
		for (var i in $scope.graph){
			if(getid == $scope.graph[i].graph_id){
				$scope.EditableGraphDash.graph_name = $scope.graph[i].graph_name;
				$scope.EditableGraphDash.graphDescription = $scope.graph[i].graphDescription;
			}
		}
	})
	.error(function(data){
		alert('error');
	});
	
	$scope.saveForm = function(){
		$modalInstance.close();
		
		$http.put(urlBase+'/graphs/update/'+getid, $scope.EditableGraphDash)
		.success(function(data){
			$scope.graph = data;
			$state.reload();
		})
		.error(function(data){
			alert('error');
		});
	}
	
    
}]);

//----------------------------------viewGraph.html controller-------------------------
controller.controller('viewGraphController',['$scope', '$http', '$modalInstance', 'graphService', '$stateParams', '$q', 'Tab3Name', function($scope, $http, $modalInstance, graphService, $stateParams, $q, Tab3Name){
	
	$scope.name3 = Tab3Name.name;
	
	$scope.graphInProject = [];
	
	var s_id = parseInt($stateParams.id);
	var p_id = graphService.get();
	var dataProvided = false;
	var getProjectAndGraphInProject = function(){
		var getProject = $http({
			method: 'GET',
			url: urlBase+'/project'
		});
		
		var getGraphInSprint = $http({
			method: 'GET',
			url: urlBase+'/graphSprint'
		});
		
		var getProjectsGraph = $http({
			method: 'GET',
			url: urlBase+'/graphInSprint/'+p_id
		})
		
		return $q.all([getProject, getGraphInSprint, getProjectsGraph]);
		
	}
	
	getProjectAndGraphInProject().then(function(data){
		$scope.project = data[0].data;
		$scope.graphInSprint = data[1].data;
		$scope.ProjectsGraph = data[2].data;
		$scope.graphOverallResult = {};
		var result = [];
		for (var i in $scope.graphInSprint){
			if(s_id == $scope.graphInSprint[i].s_id && p_id == $scope.graphInSprint[i].p_id && $scope.graphInSprint[i].inputvalue != null){
				if($scope.graphInSprint[i].color == 'green'){
					$scope.graphInSprint[i].smilley = 'resources/images/icn-green.png';
				}
				else if($scope.graphInSprint[i].color == 'red'){
					$scope.graphInSprint[i].smilley = 'resources/images/icn-red.png';
				}
				$scope.graphInProject.push( $scope.graphInSprint[i]);
				dataProvided = true;
			}
			
			
		}
		for(var z in $scope.graphInSprint){
			if(s_id == $scope.graphInSprint[z].s_id && p_id == $scope.graphInSprint[z].p_id){
				result.push($scope.graphInSprint[z]);
			}
		}
		$scope.graphOverallResult.result = result;
		
		for(var k in $scope.ProjectsGraph){
			if(dataProvided == false){
				$scope.ProjectsGraph[k].smilley = 'resources/images/icn-red.png';
				$scope.ProjectsGraph[k].action_plan = 'Data Not Provided';
				$scope.ProjectsGraph[k].g_name = $scope.ProjectsGraph[k].graph_name;
				
				$scope.graphInProject.push( $scope.ProjectsGraph[k]);
			}
		}
		for(var j in $scope.project){
			if(p_id == $scope.project[j].p_id){
				$scope.projectName = $scope.project[j].p_name;
			}
		}
	});
	$modalInstance.close();
	$scope.ok = function(){
		$modalInstance.dismiss();
	};
}]);

//------------------------------dashresult.html controller-------------------------
controller.controller('dashresultController',['$scope', 'graphService', '$modalInstance', '$filter', '$http', '$q', '$modal', function ($scope, graphService, $modalInstance, $filter, $http, $q, $modal) {

	$scope.dashresult = []
	var getid = graphService.get();
		var getEveryThing = function(){
			var getProject = $http({
				method: 'GET',
				url: urlBase+'/project'
			});
			
			var getGraphInSprint = $http({
				method: 'GET',
				url: urlBase+'/graphSprint'
			});
			
			var getSprint = $http({
				method: 'GET',
				url: urlBase+'/sprintDetails'
			});
			
			return $q.all([getProject, getGraphInSprint, getSprint]);
		}
		
		getEveryThing().then(function(data){
			$scope.project = data[0].data;
			$scope.graphInSprint = data[1].data;
			$scope.sprint = data[2].data;
			
			var convertor = function (s) {
	        	  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	        	  var d = new Date(s);
	        	  var da = d.getDate();
	        	  var suffix;
	        	  if(da == 1 || da == 21 || da == 31)
	        		  suffix = 'st';
	        	  else if(da == 2 || da == 22)
	        		  suffix = 'nd';
	        	  else if(da == 3 || da == 23)
	        		  suffix = 'rd';
	        	  else
	        		  suffix = 'th';
	        	  
	        	  return d.getDate() + suffix + ' ' + months[d.getMonth()] + ',' + d.getFullYear();
		    }
			for(var k in $scope.sprint){
				if($scope.sprint[k].s_id == getid){
					$scope.date = convertor($scope.sprint[k].meeting_date);
				}
			}
			
			for (var i in $scope.project){
				$scope.project[i].Graph = [];
				for (var j in $scope.graphInSprint){
					if(getid == $scope.graphInSprint[j].s_id && $scope.project[i].p_id == $scope.graphInSprint[j].p_id){
						$scope.project[i].Graph.push($scope.graphInSprint[j]);
					}
				}
				$scope.dashresult.push($scope.project[i]);
			}
			
		});
		
	 var page = 1;
	    $('#printbody')
	    	.click(function(){
	    		$this.focus();
	    	})
	    	.keydown(function(ev){
	    		if(ev.keycode == 37){
	    			page--;
	    		}
	    		else if(ev.keycode == 39){
	    			page++;
	    		}
	    	});
	    
	    $scope.ViewTrends = function(p_id){
			 
			 $http.get(urlBase+'/graphSprint/'+p_id)
			.success(function(data){
				$scope.graphSprint = data;
				graphService.setArray($scope.graphSprint);
			})
			.error(function(data){
				alert('error');
			});
			 
			 graphService.set(p_id);
			 $modal.open({
					templateUrl: 'resources/views/viewTrends.html',
					controller: 'viewTrendsController',
					size: 'lg',
					backdrop: 'static',
			        keyboard: false
				});
		 }
	
    $scope.printForm = function (divName) {
        $modalInstance.close();
        document.getElementById("printbody").style.overflow = "initial";
        document.getElementById("printbody").style.height = "auto";
        var printContents = document.getElementById(divName).innerHTML;
        var popupWin = window.open('', '_blank', 'width=300,height=300');
        popupWin.document.open()
        popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="resources/style/style.css" /><link href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css" rel="stylesheet"><script src="resources/scripts/angular-ui/ui-bootstrap-tpls.min.js"></script><script src="//angular-ui.github.io/bootstrap/ui-bootstrap-tpls-0.12.0.js"></script></head><body onload="window.print()">' + printContents + '</html>');
        popupWin.document.close();
    }
    
    $scope.cancelForm = function(){
		$modalInstance.dismiss();
	}
    
    $scope.dataProvided = function(graph){
    	var data = $filter('totalgraphcount')(graph);
    	
    	if(data >0){
    		return true;
    	}
    	else
    		return false;
    }
    
}]);



}());