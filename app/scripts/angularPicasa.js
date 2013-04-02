'use strict';

angular.module('angularPicasa', [])
  .directive('picasa', ['picasaService', function(picasaService) {
    return {
      //works on attribute
      restrict: 'A',
      replace: true,
      scope: {},
      template: '<div ng-show="ready"><div class="picasa-photo"><img src="{{current.url}}" height="{{height}}" width="{{width}}"></div>' +
                          '<div class="picasa-thumbs" ng-mousemove="move($event)">' +
                          '<ul ng-repeat="photo in photos">' + 
                          '<li><a ng-mouseover="setCurrent(photo)"><img src="{{photo.thumb}}" height="{{thumbHeight}}" width="{{thumbWidth}}"></a></li>' + 
                          '</ul>' + 
                          '</div></div>',
      link: function(scope, element, attrs) {
        scope.height = attrs.height;
        scope.width = attrs.width;
        scope.thumbWidth = attrs.thumbWidth;
        scope.thumbHeight = attrs.thumbHeight;
        console.log(scope.thumbWidth);
        picasaService.get(attrs.picasa).then(function(data) {
          scope.photos = data;
          scope.current = data[0];
          scope.ready = true;
        })
        
        scope.setCurrent = function(photo) {
          console.log('photo');
          scope.current = photo;
        };
        scope.move = function(event) {
          var thumbDiv = element[0].lastChild;
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
          data.feed.entry.forEach(function(entry) {
            photos.push(parsePhoto(entry));
          });
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
