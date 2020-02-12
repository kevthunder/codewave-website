const $ = jQuery;

$(function() {
  $(window).scroll(function(event) {
    const scroll = $(window).scrollTop();
    $('header').toggleClass('fixed', scroll > 100);
    $('header').toggleClass('notfixed', scroll <= 100);
  });
});