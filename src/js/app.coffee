angular.module("app", [
  'ui.bootstrap',
  'angularBootstrapNavTree',
  "ngSanitize",
  "com.2fdevs.videogular",
  "com.2fdevs.videogular.plugins.controls",
  "com.2fdevs.videogular.plugins.overlayplay",
  "com.2fdevs.videogular.plugins.poster",
  "com.2fdevs.videogular.plugins.buffering"
])
.config ($sceDelegateProvider)->
  $sceDelegateProvider.resourceUrlWhitelist [
    'file://**'
  ]
.run ($rootScope,$modal,$http,videoService,$sce)->
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
            path : encodeURI(item.title)+'/'+encodeURI(chap.title+'/')
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

  controller.onCompleteVideo = ->
    controller.isCompleted = true
    controller.currentVideo++
    if controller.currentVideo >= controller.videos.length
      controller.currentVideo = 0
    controller.setVideo controller.currentVideo

  controller.videos = [
    {
      sources: [
        {src: '%E1%84%86%E1%85%AE%E1%84%92%E1%85%A1%E1%86%AB%E1%84%83%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB:%20Season%20381%20Clips/Infinite%20Challenge,%20Vote%202014%20(5)%20#01%20%E1%84%89%E1%85%A5%E1%86%AB%E1%84%90%E1%85%A2%E1%86%A8%202014%20(5)%2020140531-lqDffvLCsdc.mp4', type: "video/mp4"},
       ]
    }
  ];

  controller.config = {
    preload: "metadata"
    autoHide: false
    autoHideTime: 3000
    autoPlay: false
    sources: controller.videos[0].sources,
    theme: {
      url: "vendor/videogular-themes-default/videogular.css"
    }
  };

  controller.setVideo =(index)->
    controller.API.stop();
    controller.currentVideo = index;
    controller.config.source = controller.videos[index].source;


  playVideo = ()->
    console.log this
    controller.rootPath = this.path
    controller.videos = []
    _.each this.item.clips,(clip)->
#      console.log '/file/'+controller.rootPath+clip
      controller.videos.push('/file/'+controller.rootPath+encodeURI(clip))
    controller.currentVideo = 0;
    controller.config.source = controller.videos[0];
    $rootScope.$apply()
    console.log controller.config.source
