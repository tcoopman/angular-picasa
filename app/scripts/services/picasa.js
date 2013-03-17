"use strict";

angularPicasa.factory('picasa', ['$http', '$q', function($http, $q) {
  // Service logic

  $http.defaults.useXDomain = true;
  
  var current = $q.defer();

  function parsePhoto(entry) {
    var lastThumb = entry.media$group.media$thumbnail.length - 1
    var photo = {
      thumb: entry.media$group.media$thumbnail[lastThumb].url,
      thumbHeight: entry.media$group.media$thumbnail[lastThumb].height,
      thumbWidth: entry.media$group.media$thumbnail[lastThumb].width,
      url: entry.media$group.media$content[0].url
    };
    return photo;
  }
  
  function parsePhotos(url) {
    var d = $q.defer();
    var photo;
    var photos = [];
    loadPhotos(url).then(function(data) {
      if (!data.feed) {
        photos.push(parsePhoto(data.entry));
      } else {
        data.feed.entry.forEach(function(entry) {
          photos.push(parsePhoto(entry));
        });
      }
      console.log("resolving");
      current.resolve(photos[0]);
      d.resolve(photos);
      console.log("resolving");
      
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
