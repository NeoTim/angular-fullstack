'use strict';

angular.module('angularFullstackApp')
  .controller('MainCtrl', function ($scope, $http, socket, $firebase) {

      $scope.expanded          = false;
      $scope.awesomeThings = [];
      $scope.updateThing      = updateThing;
      $scope.addThing           = addThing;
      $scope.deleteThing       = deleteThing;
      $scope.expand              = expand;

      //////////////////////

      function initialize(){      
            $http.get('/api/customers').success(function (data) {
                  $scope.customers = data;
                  socket.syncUpdates('customer', $scope.customers);
            });
      }
      function updateThing(thing){
            $http.put('/api/customers/' + thing._id, thing)
               .success(function (data){
                 console.log(data)
               })
      }
      function addThing(index) {
            index = index+1 || 0;
            $http.post('/api/customers', { company: $scope.newThing, position: index });
            // $scope.customers.$add($scope.newThing)
            $scope.newThing = '';
      }
      function deleteThing(thing) {
            $http.delete('/api/customers/' + thing._id);
      }

      function expand(){
        $scope.expanded = !$scope.expanded;
        console.log($scope.expanded)
      }

      initialize()

      $scope.$on('$destroy', function () {
        socket.unsyncUpdates('customer');
      });
  });





    // var ref = new Firebase("https://my-data-test.firebaseio.com/customers");
    // var sync = $firebase(ref).$asArray();
    // // download the data into a local object
    // // var syncObject = sync.$asObject();
    // // synchronize the object with a three-way data binding
    // // click on `index.html` above to see it used in the DOM!
    // // syncObject.$bindTo($scope, "data");
    // // $scope.customers = sync.$asObject();

    // console.log($scope.customers)
// Array.prototype.insert = function (index, item) {
//        this.splice(index, 0, item);
//     };
