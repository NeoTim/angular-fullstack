'use strict';

angular.module('app')
  .directive('keyTrap', function() {
    return function( scope, elem ) {
      elem.bind('keydown', function( event ) {
        event.preventDefault();
        scope.$broadcast('keydown', { code: event.keyCode } );
      });
    };
  })
  .controller('MainCtrl', function ($document, $scope, $http, socket, Restangular, hotkeys) {
    Array.prototype.insert = function (index, item) {
      this.splice(index, 0, item);
    };


    hotkeys.add({
      combo: 'enter',
      description: 'add new thing',
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: function(e, hotkey) {
        e.preventDefault()
        console.log(hotkey)
        var index = Number(e.target.id)+1;
        console.log(index)
        $scope.addThing(index)
        // angular.element('input').eq(index).focus()
      }
    });

    $scope.awesomeThings = [];
    $scope.showDetails = false;
    /////
    $scope.addThing = addThing;
    $scope.deleteThing = deleteThing;
    $scope.openDetails = openDetails;
    $scope.checkEmpty = checkEmpty;
    $scope.keyPress = keyPress;


    // getThings()

    $scope.awesomeThings = [
      {name: 'Joel'},
      {name: 'cox'},
      {name: 'hello'}
    ]

    /////////////////////

    function getThings(){
      return Restangular.all('things')
      .getList().then(function (data){
        console.log(data)
        $scope.awesomeThings = data;
        socket.syncUpdates('thing', $scope.awesomeThings);
      })
    }

    function addThing(index){
      index = index || 0;
      $scope.awesomeThings.insert(index, {name: ''});
      // $scope.$broadcast('newItemAdded');
      // angular.element('#'+index+1).trigger('focus');
      // console.log(angular.element('#'+index+1))

      // $scope.awesomeThings
      //   .post({name:$scope.newThing})
      //   .then(function (data){
      //     $scope.newThing = '';
      //   })

    }


    function deleteThing(thing, index) {
      $scope.awesomeThings.splice(index, 1)
      // Restangular.one('things', thing._id).remove();
    }

    function keyPress(event, thing, index){
      console.log(thing.$element)
      if(thing.name) thing.empty = false;
      // if(event.keyCode === 13) return addThing(index);
      // console.log(event.keyCode)
      if(event.keyCode !== 8) return;
      if(thing.name === "") return deleteThing(thing, index);
      // if(thing.name === "") return thing.empty = true;

    }

    function checkEmpty(thing){
      // console.log(thing)
      // if(thing.empty) return thing.remove();
      // if(!thing.name) return thing.empty = true;
    }

    function openDetails(thing){
      if(!$scope.details){
        $scope.showDetails = true;
        $scope.details = thing;
        return;
      }
      if(thing._id === $scope.details._id) {
        $scope.showDetails = false;
        $scope.details = null;
        return;
      }
      $scope.showDetails = true;
      $scope.details = thing;
    }


    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });
  });
