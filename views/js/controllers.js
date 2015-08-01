var postsControllers = angular.module('postsControllers', []);

postsControllers.controller('PostsController', ['$scope', '$http', function($scope, $http) {

	$http.get('/posts').success(function(data) {
		console.log(data);
		$scope.posts = data;
	});
}]);



postsControllers.controller('Controller', function($scope, ModalService) {
    
    $scope.show = function() {
        ModalService.showModal({
            templateUrl: 'modal.html',
            controller: "ModalController"
        }).then(function(modal) {
            modal.element.modal();
            modal.close.then(function(result) {
                $scope.message = "You said " + result;
            });
        });
    };
    
});

postsControllers.controller('ModalController', function($scope, close) {
  
 $scope.close = function(result) {
 	close(result, 500); // close, but give 500ms for bootstrap to animate
 };

});