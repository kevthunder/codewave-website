(function() {
  var $;

  $ = jQuery;

  $(function() {
    return $(window).scroll(function(event) {
      var scroll;
      scroll = $(window).scrollTop();
      $('header').toggleClass('fixed', scroll > 100);
      return $('header').toggleClass('notfixed', scroll <= 100);
    });
  });

}).call(this);

//# sourceMappingURL=scroll.js.map
