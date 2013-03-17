angularPicasa.directive('picasa', ['picasa', function(picasa) {
  return {
    //works on attribute
    restrict: 'A',
    replace: true,
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
      picasa.get(attrs.picasa).then(function(data) {
        scope.photos = data;
        scope.current = picasa.current();
        scope.ready = true;
      })
      
      scope.setCurrent = function(photo) {
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
}]);
