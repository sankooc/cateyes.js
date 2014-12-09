angular.module('app').factory 'videoService',($q)->
  metadata : ->
    $q.reject()
  download : ->
