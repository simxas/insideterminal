var myApp = angular.module("myApp", [
  'ngRoute',
  'ui.tinymce',
  'angularModalService',
  'postsControllers'
]);

myApp.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.
  when('/', {
    templateUrl: 'home.html'
  }).
  when('/post', {
    templateUrl: 'post.html'
  }).
  when('/about', {
    templateUrl: 'about.html'
  })

}]);

myApp.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});

myApp.filter("sanitize", ['$sce', function($sce) {
  return function(htmlCode){
    return $sce.trustAsHtml(htmlCode);
  }
}]);