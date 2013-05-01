'use strict';

angular.module('angularPicasa', [])
  .directive('picasa', ['picasaService', function(picasaService) {
    return {
      //works on attribute
      restrict: 'A',
      replace: true,
      scope: { 
        picasa: '@'
      },
      templateUrl: 'picasa.html',
      link: function(scope, element, attrs) {
        if (attrs.height !== undefined && attrs.width !== undefined) {
          scope.size = 'both';
        } else {
          if (attrs.height !== undefined) {
            scope.size = 'height';
          }
          if (attrs.width !== undefined) {
            scope.size = 'width';
          }
        }
        scope.height = attrs.height;
        scope.width = attrs.width;

        if (attrs.thumbHeight !== undefined && attrs.thumbWidth !== undefined) {
          scope.thumbSize = 'both';
        } else {
          if (attrs.thumbHeight !== undefined) {
            scope.thumbSize = 'height';
          }
          if (attrs.thumbWidth !== undefined) {
            scope.thumbSize = 'width';
          }
        }
        scope.thumbHeight = attrs.thumbHeight;
        scope.thumbWidth = attrs.thumbWidth;

        scope.$watch('picasa', function () {
          if (scope.picasa === '') {
            return;
          }
          picasaService.get(scope.picasa).then(function(data) {
            scope.photos = data;
            scope.current = data[0];
            scope.ready = true;
          })
        });
        
        scope.setCurrent = function(photo) {
          scope.current = photo;
        };
        scope.move = function(event) {
          var thumbDiv = element[0].lastElementChild;
          var x = event.clientX - thumbDiv.offsetLeft;
          var center = thumbDiv.offsetWidth / 2;
          var factor = 20;

          var delta = (x - center)/center * factor;

          if (delta > 0 && thumbDiv.scrollLeft < (thumbDiv.scrollWidth - thumbDiv.clientWidth)) {
              thumbDiv.scrollLeft += delta;
          }
          if (delta < 0 && thumbDiv.scrollLeft > 0) {
              thumbDiv.scrollLeft += delta;
          }

        }
      }
    };
  }])
  .factory('picasaService', ['$http', '$q', function($http, $q) {
    // Service logic

    $http.defaults.useXDomain = true;
    
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
          var entries = data.feed.entry;
          for (var i = 0; i < entries.length; i++) {
            photos.push(parsePhoto(entries[i]));
          }
        }
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
      }
    };
  }]);

