(function () {

var filter = angular.module('Filter', ['Service']);


filter.filter('graphcount', function () {
    return function (input, color) {
        var count = 0;
        for (i in input) {
            if (input[i].color === color) {
                count++;
            }
        }
        return count;
    }
});

filter.filter('nacount', function () {
    return function (input) {
        var count = 0;
        for (i in input) {
            if (input[i].na == true) {
                count++;
            }
        }
        return count;
    }
});

filter.filter('totalgraphcount', function () {
    return function (input) {
        var count = 0;
        for (i in input) {
        	if(input[i].inputvalue != null){
        		count++;
        	}
        }
        return count;
    }
});

filter.filter('Percent', function ($http) {
	return function (input) {
        var percent = 0;
        var count = 0;
        var total = 0;
        var nullvalues = 0;
        var nacount = 0;
        
        for (i in input) {
            if (input[i].color === 'green') {
                count++;
            }
            if(input[i].inputvalue != null && input[i].na == false){
        		total++;
        	}
        	if(input[i].inputvalue == null && input[i].na == false){
        		nullvalues++;
        	}
        	if(input[i].na == true){
        		nacount++;
        	}
        }
        percent = count / total * 100;
        if(nullvalues == input.length){      // data not provided
        	return 'resources/images/icn-red.png'
        }
        if(nacount == input.length){    // if all graphs are NA 
        	return ''
        }
        else{
        	if(percent == 100){
            	return 'resources/images/icn-green.png'
			}
			else if (percent >=60 && percent < 100) {
					return 'resources/images/icn-yellow.png'
			}
			else {
				return 'resources/images/icn-red.png'
			}
        }
     }
    
});

filter.filter('ActionPlan', function(){
	return function(input){
		var plan = [];
		for (var i in input){
			if(input[i].action_plan != ""){
				plan.push(input[i]);
			}
		}
		return plan;
	}
});

filter.filter('pageDisplay',function(){
    return function(input,recordsPerPage,currentIndex){
        return input.slice(parseInt(currentIndex * recordsPerPage), parseInt((currentIndex + 1)*recordsPerPage + 1) - 1);
    }
});


}());