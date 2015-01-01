angular.module("app", [
  'ui.bootstrap',
#  'ui.bootstrap.pagination',
  'angularBootstrapNavTree',
  "ngSanitize",
  "com.2fdevs.videogular",
  "com.2fdevs.videogular.plugins.controls",
  "com.2fdevs.videogular.plugins.overlayplay",
  "com.2fdevs.videogular.plugins.poster",
  "com.2fdevs.videogular.plugins.buffering"
]).run ($rootScope,$modal,$http,videoService,$sce)->
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

    _scope.getMetadata = ->
      console.log 'metadata'
      videoService.metadata(option).then (metadata)->
        _scope.param = _.clone metadata
    _scope.createVod = ->
      console.log _scope.option
      $rootScope.videos.push
        title:'test--hadhe'
        prefix:'flv'
        progress : 20
        size : 10453
      instance.close()



  $rootScope.filedata = []

  $rootScope.getFiles = ->
    $http.get('/api/files').then (res)->
      console.log(res.data);
      _.each res.data.albums,(item)->
        nav =
          label : item.title
          children : []
          expanded : true
        _.each item.chapters,(chap)->
          nav.children.push(
            label : chap.title
            onSelect : playVideo
            path : encodeURIComponent(item.title)+'/'+encodeURIComponent(chap.title)+'/'
            item : chap
          )
        $rootScope.filedata.push nav
  $rootScope.getFiles()



  controller = $rootScope.controller= {
    state : null
    API : null
    currentVideo : null
  }

  $rootScope.onPlayerReady = (API)->
    controller.API = API
    if controller.API.currentState == 'play' || controller.isCompleted
      controller.API.play()
    controller.isCompleted = false
    true

  controller.onCompleteVideo = ->
    controller.isCompleted = true
    controller.currentVideo++
    console.log('complete'+controller.currentVideo);
    if controller.currentVideo >= controller.videos.length
      controller.currentVideo = 0
    controller.setVideo controller.currentVideo

  controller.videos = [];

  controller.config = {
    preload: "metadata"
    autoHide: false
    autoHideTime: 3000
    autoPlay: false
    theme: {
      url: "vendor/videogular-themes-default/videogular.css"
    }
  };

  controller.setVideo =(index)->
    controller.currentVideo = index;
    controller.config.sources = controller.videos[index];


  playVideo = ()->
    console.log this
    controller.rootPath = this.path
    controller.videos = []
    $rootScope.clips = this.item.clips
    $rootScope.bigTotalItems = this.item.clips.length
    _.each this.item.clips,(clip)->
      controller.videos.push([{
        src : '/file/'+controller.rootPath+encodeURIComponent(clip)
        type: "video/mp4"
      }])
    controller.currentVideo = 1
    controller.config.sources = controller.videos[0]

  $rootScope.$watch 'controller.currentVideo',(index)->
    console.log('currentpage'+index)
    controller.config.sources = controller.videos[index-1];

  $rootScope.totalItems = 1
  $rootScope.maxSize = 10
  $rootScope.bigTotalItems = 0
  $rootScope.currentpage = 1