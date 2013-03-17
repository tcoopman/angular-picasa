"use strict";

angularPicasa.factory('picasa', ['$http', '$q', function($http, $q) {
  // Service logic

  $http.defaults.useXDomain = true;
  
  var current = $q.defer();
  
  function parsePhotos(url) {
    var d = $q.defer();
    var photo;
    var photos = [];
    loadPhotos(url).then(function(data) {
      data.feed.entry.forEach(function(entry) {
        photo = {
          thumb: entry.media$group.media$thumbnail[2].url,
          thumbHeight: entry.media$group.media$thumbnail[2].height,
          thumbWidth: entry.media$group.media$thumbnail[2].width,
          url: entry.media$group.media$content[0].url
        };
        photos.push(photo);
      });
      current.resolve(photos[0]);
      d.resolve(photos);
      
    });
    return d.promise;
  }

  function loadPhotos(url) {
    var d = $q.defer();
    $http.jsonp(url + '?alt=json&kind=photo&hl=pl&imgmax=912&callback=JSON_CALLBACK').success(function(data, status) {
      d.resolve(data);
    });
    return d.promise;
  }

  // Public API here
  return {
    get : function (url) {
      return parsePhotos(url);
    },
    current : function () {
      return current.promise;
    }
  };
}]);
