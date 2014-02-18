jQuery(document).ready(function($) {

  $('html').removeClass('no-js');

  // Navigation Toggle
  $('.nav--toggle').click(function(e) {
    toggleMenu(e);
  });

  function toggleMenu(e){
    e.preventDefault();
    $('.layout').toggleClass('is--pushed-down is--pushed-up');
    $('.nav--toggle').toggleClass('nav--open');
    $('.nav--toggle').find('i').toggleClass('fa-bars fa-times');
  }

  // Frontpage Header
  if ( $( window ).width() >= 600 ){
    $('#hello').css( 'height', $( window ).height() );
  }

  $( window ).resize(function() {
    if ( $( window ).width() >= 600){
      $('#hello').css( 'height', $( window ).height() );
    }else{
      $('#hello').css( 'height', '');
    }
  });

});
