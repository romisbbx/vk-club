angular.module('vk').directive('handScrollable', function(){
  return {
    priority: 99,
    link: function(scope, element, attrs){
      var outer = $(element).wrap('<div class="scrollable-outer" style="max-height: '+attrs.handScrollable+'px;" />').parent();
      var inner = $(element).wrap('<div class="scrollable-inner" style="max-height: '+attrs.handScrollable+'px;" />').parent();
      var scroller = $('<div class="scrollable-scroller-wrapper"><div class="scrollable-scroller"></div></div>').appendTo(outer).children().first();
      var scrollerWrapper = scroller.parent();

      var wrapperHeight, innerHeight, height, maxTop;

      var changeSize = function(){
        wrapperHeight = outer.height();
        innerHeight = inner[0].scrollHeight;
        height = (wrapperHeight / innerHeight * 100).toFixed(2);
        if (isNaN(height)) {
          height = 100;
        }
        maxTop = (innerHeight - wrapperHeight) / innerHeight * 100;
        scroller.css({height: height + "%"});
        if (height == 100 || !height) {
          scrollerWrapper.hide();
        }
        else {
          scrollerWrapper.show();
        }
      };

      inner.on('scroll', function(){
        scroller.css({top: inner.scrollTop() / innerHeight * 100 + '%'});
      });

      changeSize();

      $(element).on('DOMSubtreeModified', changeSize);

      scroller.on('mousedown.scroller', function(e){
        scroller.addClass('scrolling');
        var startY = e.clientY;
        var startTop = parseInt(scroller.css('top'), 10) || 0;
        $(document).on('mousemove.scroller', function(e){
          inner.scrollTop(startTop  + (e.clientY - startY)/ scrollerWrapper.height() * innerHeight);
          e.preventDefault();
        });
      });
      $(document).on('mouseup.scroller', function(){
        $(document).off('mousemove.scroller');
        scroller.removeClass('scrolling');
      });

      if (attrs.handScrollableVar) {
        scope.$watch(attrs.handScrollableVar, function(){
          setTimeout(changeSize, 100);
        });
      }
    }
  };
});