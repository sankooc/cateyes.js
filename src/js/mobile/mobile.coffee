angular.module('mobile', ['ionic'])
.run ($ionicPlatform,$rootScope,$http)->
  $ionicPlatform.ready ->
    if window.StatusBar
      StatusBar.styleDefault()
  $rootScope.getIndex2 = (title)->
    if !title
      return 0
    m = title.match /Season\s+(\d+)\s/
    if m && m.length
      return parseInt m[1]
    return 0

  $rootScope.getIndex = (title)->
    if !title
      return 0
    m = title.match /#(\d+)/
    if m && m.length
      return parseInt m[1]
    return 0

.config ($stateProvider, $urlRouterProvider)->
  $stateProvider
  .state 'app', {
      url: "/app"
      abstract: true
      templateUrl: "templates/menu.html"
      controller : "MenuController"
  }
  .state 'app.home',{
      url: "/home"
      views: {
        'menuContent': {
          templateUrl: "templates/home.html"
        }
      }
  }
  .state 'app.chapters', {
      url: "/chapters/:name"
      views: {
        'menuContent': {
          templateUrl: "templates/chapters.html"
          controller : "AlbumController"
        }
      }
  }
  .state 'app.clips', {
      url: "/clips/:album/:chapter"
      views: {
        'menuContent': {
          templateUrl: "templates/clips.html"
          controller : "ClipsController"
        }
      }
  }
  $urlRouterProvider.otherwise '/app/home'

.directive 'ionicVideo',($parse,$timeout,$compile)->
  {
    restrict: 'E'
    transclude: true
    replace : true
    template : '<video controls></video>'
    link : ($scope,$element,$attr)->
      $element[0].addEventListener "canplay",->
        console.log 'can play'
      $element[0].addEventListener "ended",->
        console.log 'ended play next'+$scope._index++
        playVideo $scope._index
      playVideo = (index)->
        list = $parse($attr.ngModel)($scope)
        if !list || list.length <= index
          return
        source = list[index]
        $scope._index = index
        if($element[0].children.length)
          $element[0].pause()
          $element.find('source').attr('src',source)
          $element[0].load()
          $element[0].play()
          return
        html = '<source src="'+source+'" type="video/mp4">'
        $element.append(html)
        $element[0].load()
        $element[0].play()
      $scope.$on 'poct',(event,index)->
        playVideo index

  }

.controller 'MenuController',($scope,$http,$state,$rootScope)->
  $http.get('/api/albums').then (res)->
    $scope.albums = res.data
.controller 'AlbumController',($scope,$http,$stateParams,$rootScope)->
  $scope.name = $stateParams.name
  $http.get('/api/albums/'+$scope.name).then (res)->
    $scope.chapters = res.data;
    $scope.chapters.sort (a,b)->
      $rootScope.getIndex2(a) - $rootScope.getIndex2(b)

.controller 'ClipsController',($scope,$http,$stateParams,$rootScope)->
  $scope.album = $stateParams.album
  $scope.chapter = $stateParams.chapter

  $http.get('/api/albums/'+$scope.album+'/'+ $scope.chapter).then (res)->
    $scope.clips = res.data;
    $scope.clips.sort (a,b)->
      $rootScope.getIndex(a) - $rootScope.getIndex(b)
    $scope.sources = []
    _.each $scope.clips,(clip)->
      source = '/file/'+encodeURIComponent($scope.album)+'/'+encodeURIComponent($scope.chapter)+'/'+encodeURIComponent(clip)
      $scope.sources.push source

  $scope.select = (index)->
    $scope.$broadcast('poct',index)