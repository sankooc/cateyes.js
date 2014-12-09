angular.module("app", ['ui.bootstrap']).run ($rootScope,$modal)->
  $rootScope.videos = [
      title:'broke girls E03'
      ,prefix:'mega-4'
      ,progress : 90
      ,size : 1003453
  ];
  $rootScope.removeVideo = ->
    _self = this.v;
    option =
      templateUrl :'confirm.html',
      size: 'sm'
    instance = $modal.open(option);
    instance.result.then (flag)->
      if flag
        inx = $rootScope.videos.indexOf _self
        if inx>=0
          $rootScope.videos.splice inx,1

  $rootScope.addVideo = ->
    _scope = $rootScope.$new();
    _scope.option =
      type: 'url'
      province_id : 'youku'
    _scope.types = ['url','vid','batch']
    _scope.providers = [
      id:'youku'
      name:'优酷'
    ,
      id:'sohu'
      name:'搜狐'
    ,
      id:'tencent'
      name:'腾讯'
    ,
      id:'youtube'
      name:'youtube'
    ]
    option =
      templateUrl :'video_dialog.html'
      scope:_scope
      size: 'lg'
    instance = $modal.open option

    _scope.createVod = ->
      console.log _scope.option
      $rootScope.videos.push
        title:'test--hadhe'
        prefix:'flv'
        progress : 20
        size : 10453
      instance.close()

