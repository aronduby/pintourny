'use strict';

/* Directives */


angular.module('myApp.directives', [])
/*
 *	Show/Hide elements based on the users role
 *	Usage: <li access-level='accessLevels.(anon|user|admin|other role from config)'>hello</li>
*/
.directive('accessLevel', ['Auth', function(Auth) {
	return {
		restrict: 'A',
		link: function($scope, element, attrs) {
			var prevDisp = element.css('display'),
				userRole,
				accessLevel;

			$scope.user = Auth.user;
			$scope.$watch('user', function(user) {
				if(user.role)
					userRole = user.role;
				updateCSS();
			}, true);

			attrs.$observe('accessLevel', function(al) {
				if(al) accessLevel = $scope.$eval(al);
				updateCSS();
			});

			function updateCSS() {
				if(userRole && accessLevel) {
					if(!Auth.authorize(accessLevel, userRole))
						element.css('display', 'none');
					else
						element.css('display', prevDisp);
				}
			}
		}
	};
}])

/*
 *	Adds/Removes .active class to link (or link parent) elements
 *	Usage: <li activeNav><a href="/">home</a></li>
*/
.directive('activeNav', ['$location', function($location) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			var anchor = element[0];
			if(element[0].tagName.toUpperCase() != 'A')
				anchor = element.find('a')[0];
			var path = anchor.href;

			scope.location = $location;
			scope.$watch('location.absUrl()', function(newPath) {
				path = normalizeUrl(path);
				newPath = normalizeUrl(newPath);

				if(
					path === newPath 
					|| (attrs.activeNav === 'nestedTop' && newPath.indexOf(path) === 0)
				) {
					element.addClass('active');
				} else {
					element.removeClass('active');
				}
			});
		}
	};

	function normalizeUrl(url) {
		if(url[url.length - 1] !== '/')
			url = url + '/';
		return url;
	}
}])

/*
 *	Bootstrap based button group which acts as checkboxes
*/
.directive('btnCheckboxGroup', function(){
	return {
		restrict: 'E',
		templateUrl: 'partials/directives/btncheckboxgroup.html',
		scope: {
			allowed: '=',
			applied: '=',
			id: '=',
			title: '='
		},
		link: function(scope, elem, attrs){ 
			if(scope.applied == undefined)
				scope.applied = [];

			if(attrs.vertical !== undefined && attrs.vertical !== false){
				scope.vertical = true;
			}
			if(attrs.justified !== undefined && attrs.justified !== false){
				scope.justified = true;
			}
			scope.abp = [];

			// this works right away, but how do I run it when the parent scope updates it?
			scope.$watch("applied", function(){
				scope.abp = [];
				angular.forEach(scope.applied, function(obj){
					scope.abp.push( obj[scope.id] );
				});
			}, true);
			
			scope.addRemove = function(a){
				var index = scope.abp.indexOf(a[scope.id]);
				
				// doesn't exist, add it
				if(index === -1){
					scope.abp.push(a[scope.id]);
					scope.applied.push(a);
				
				// does exist, remove it
				} else {
					scope.abp.splice(index, 1);
					for(var i in scope.applied){
						if(scope.applied[i][scope.id]==a[scope.id]){
							scope.applied.splice(i,1);
							break;
						}
					}
				}
			}// end addRemove()
			
		}
	};
})

/*
 *	Formats input value with commas but keeps the model as number
*/
.directive('currencyInput', function($filter, $browser) {
    return {
        require: 'ngModel',
        link: function($scope, $element, $attrs, ngModelCtrl) {
            var listener = function() {
                var value = $element.val().replace(/,/g, '');
                $element.val($filter('number')(value, 0));
            }
            
            // This runs when we update the text field
            ngModelCtrl.$parsers.push(function(viewValue) {
                return viewValue.replace(/,/g, '');
            })
            
            // This runs when the model gets updated on the scope directly and keeps our view in sync
            ngModelCtrl.$render = function() {
                $element.val($filter('number')(ngModelCtrl.$viewValue, 0))
            }
            
            $element.bind('change', listener)
            $element.bind('keydown', function(event) {
                var key = event.keyCode
                // If the keys include the CTRL, SHIFT, ALT, or META keys, or the arrow keys, do nothing.
                // This lets us support copy and paste too
                if (key == 91 || (15 < key && key < 19) || (37 <= key && key <= 40)) 
                    return 
                $browser.defer(listener) // Have to do this or changes don't get picked up properly
            })
            
            $element.bind('paste cut', function() {
                $browser.defer(listener)  
            })
        }
        
    }
})