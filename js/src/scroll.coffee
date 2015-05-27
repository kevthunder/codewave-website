$ = jQuery

$ ->
  $(window).scroll (event) ->
    scroll = $(window).scrollTop()
    $('header').toggleClass( 'fixed', scroll > 100 )
    $('header').toggleClass( 'notfixed', scroll <= 100 )