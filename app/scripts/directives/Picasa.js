angularPicasa.directive('picasa', ['picasa', function(picasa) {
  return {
    //works on attribute
    restrict: 'A',
    replace: true,
    template: '<div ng-show="photos"><div class="picasa-photo"><img src="{{current.url}}"></div>' +
                        '<div class="picasa-thumbs" ng-mousemove="move($event)">' +
                        '<ul ng-repeat="photo in photos">' + 
                        '<li><a ng-mouseover="setCurrent(photo)"><img src="{{photo.thumb}}" height="200"></a></li>' + 
                        '</ul>' + 
                        '</div></div>',
    link: function(scope, element, attrs) {
      scope.photos = picasa.get(attrs.picasa);
      scope.current = picasa.current();
      
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
