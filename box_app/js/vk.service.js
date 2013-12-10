'use strict';

angular.module('vk').factory('vkontakte', function($q) {
  var URL_VARS;
  // Public API here
  return {
    GID: 48475446,
    AID: 183475108,
    SUBSCRIBE_GID: 48475446,
    WIDTH: 720,
    getAlbums: function(params, callback) {
      return VK.api('photos.getAlbums', params, callback);
    },
    getPhotos: function(params, callback){
      return VK.api('photos.get', params, callback);
    },
    createAlbum: function(params, callback){
      return VK.api('photos.createAlbum', params, callback);
    },
    createAndUpload: function(params, callback){
      var self = this;
      self.createAlbum(params, function(data){
        self.uploadPhoto(data.response.aid, callback);
      });
    },
    resizeWindow: function(width, height) {
      VK.callMethod('resizeWindow', width, height);
    },
    uploadPhoto: function(aid, callback) {
      VK.api('photos.getUploadServer', {aid: aid, gid: this.GID}, function(data){
        console.log(data);
        callback(data.response.upload_url);
      });
    },
    savePhotos: function(params, callback) {
      VK.api('photos.save', params, callback);
    },
    wallPost: function(params, callback){
      VK.api('wall.post', params, callback);
    },
    getUrlVars: function(){
      if (!URL_VARS) {
        var vars = new Object(), hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for(var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars[hash[0]] = hash[1];
        }
        URL_VARS = vars;
      }
      return URL_VARS;
    },
    isAdmin: function(){
      return parseInt(this.getUrlVars().viewer_type, 10) >= 2;
    },
    getCurrentUser: function(callback){
      return this.getProfiles({
        uids: this.getUrlVars().viewer_id,
        fields: 'first_name,last_name,sex,photo_big,photo'
      }, callback);
    },
    getProfiles: function(params, callback){
      return VK.api('users.get', params, callback);
    },
    isMember: function(callback){
      return VK.api('groups.isMember', {gid: this.SUBSCRIBE_GID}, callback);
    },
    getLikes: function(posts, scope){
      for (var i =0, max = posts.length; i<max; i++) {
        (function(index){
          var post_id = posts[index].post_id;
          VK.api('wall.getLikes', {post_id: post_id}, function(data){
            scope.$apply(function(){
              posts[index].likes_count = data.response ? data.response.count : 0;
            });
          })
        }(i));
      }
    }
  };
});