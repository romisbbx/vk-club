angular.module("vk").controller('HandikaCtrl', ['$scope', 'vkontakte', '$http', '$q', function($scope, vkontakte, $http, $q){
  $scope.photos = [];
  $scope.maxBalls = 1000;
  $scope.allBalls = $scope.maxBalls;
  $scope.hasSelected = false;
  $scope.requestStarted = false;

  $scope.perPage = 10;
  $scope.statistics = [];
  $scope.statPage = 1;
  $scope.statPages = 1;

  var cover;
  var service = vkontakte;

  $scope.finish_value = 'Всё понял, запостить';
  $scope.posted = false;

  $scope.isAdmin = 0;

  var selected = {};
  var album_url = '';

  var saveData = function(data){
    $http.post('./data.php', data).success(function(response){
      $scope.statistics = response;
    });
  };

  var setStep = function(step){
    $scope.step = step;
    var el = document.getElementById('step'+step);
    el.style.display = 'block';
    service.resizeWindow(service.WIDTH, el.clientHeight + 100);
  };

  $scope.start = function(){
    setStep(2);
  };

  $scope.next = function(){
    $scope.requestStarted = true;
    service.uploadPhoto(service.AID, function(url){
      var params = {images: []};
      for (var i in selected) {
        params.images.push(selected[i]);
      }
      params.avatar = $scope.current_user.photo_big;
      params.upload_url = url;
      $http.post('./glue.php', params).success(function(data){
        service.savePhotos(data, function(data){
          cover = data.response[data.response.length-1];
          album_url = 'http://vk.com/album'+cover.owner_id+'_'+cover.aid;
          $scope.$apply(function(){
            $scope.result = cover;
            $scope.requestStarted = false;
            setStep(3);
          });
        });
      });
    });
  };

  $scope.post = function(){
    service.wallPost({message: 'Я выбрал эти призы в конкурсе Handika Box', attachments: 'photo'+cover.owner_id+'_' + cover.pid}, function(data){
      if (data.response.post_id) {
        $scope.posted = true;
        setStep(4);
        var info = {
          post_id: data.response.post_id,
          photo_url: 'http://vk.com/photo'+cover.owner_id+'_'+cover.pid,
          user_id: $scope.current_user.uid,
          user_first_name: $scope.current_user.first_name,
          user_last_name: $scope.current_user.last_name,
          user_photo: $scope.current_user.photo,
          likes: 0,
          exists: 1
        };
        saveData(info);
      }
      else {

      }
    });
  };

  $scope.finish = function(){
    setStep(3);
  };

  $scope.buttonCaption = function(photo) {
    return photo.selected ? 'Убрать из коробки' : 'Положить в коробку';
  };

  $scope.changeSelection = function(photo) {
    if (photo.selected) {
      $scope.allBalls += photo.price;
      photo.selected = false;
      delete selected[photo.item.pid];
      if (Object.getOwnPropertyNames(selected).length === 0) {
        $scope.hasSelected = false;
      }
    }
    else {
      if ($scope.allBalls >= photo.price) {
        photo.selected = true;
        $scope.allBalls -= photo.price;
        selected[photo.item.pid] = photo.item.src_big;
        $scope.hasSelected = true;
      }
    }
  };

  VK.Observer.subscribe("widgets.subscribed", function f(){
    $scope.subscribed = true;
    $scope.$digest();
  });

  VK.Observer.subscribe("widgets.unsubscribed", function f(){
    $scope.subscribed = false;
    $scope.$digest();
  });

  $scope.nextPage = function(){
    $scope.statPage++;
  };

  $scope.prevPage = function(){
    $scope.statPage--;
  };

  setStep(1);

  $http.get('./data.php', {}).success(function(data){
    $scope.statistics = data;
    $scope.statPages = Math.ceil(data.length / $scope.perPage);
  });

  service.getCurrentUser(function(data){
    $scope.current_user = data.response[0];
    $scope.user_loaded = true;
    service.isMember(function(data){
      $scope.subscribed = !!data.response;
      $scope.$digest();
    });
    $scope.isAdmin = service.isAdmin();
    $scope.secondTime = false;
    for (var i = 0, max = $scope.statistics.length; i < max; i++) {
      if ($scope.statistics[i].user_id == $scope.current_user.uid) {
        $scope.secondTime = true;
        break;
      }
    }
  });

  service.getAlbums({gid: service.GID}, function(data){
    for (var i = 0, max = data.response.length; i < max; i++) {
      if (data.response[i].title.indexOf('#contest') == -1) {
        continue;
      }
      (function(album){
        service.getPhotos({aid: album.aid, gid: service.GID}, function(photosData){
          for (var j = 0, maxJ = photosData.response.length; j < maxJ; j++) {
            var photo = {item: photosData.response[j]};
            var text = photo.item.text.split("<br>");
            var master = text[1].split(', ');
            text = text[0].split('. ');
            photo.description = text[1];
            photo.master = {
              name: master[0],
              avatar: master[2],
              link: master[1]
            };
            photo.selected = false;
            photo.price = parseInt(text[0].split(' ')[0], 10);
            $scope.photos.push(photo);
          }
          $scope.$digest();
        });
      }(data.response[i]));
    }
  });

  var savedHeight = 0;

  $scope.$watch('showStatistics', function(value){
    if (value) {
      savedHeight = $("body").outerHeight();
      service.resizeWindow(service.WIDTH, 930);
    }
    else if (savedHeight) {
      service.resizeWindow(service.WIDTH, savedHeight - 3);
    }
  });
}]);