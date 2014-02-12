jQuery(document).ready(function($) {
  $('html').removeClass('no-js');

  // Dropdown
  $('.nav--toggle').click(function(e) {
    toggleMenu(e);
  });

  function toggleMenu(e){
    e.preventDefault();
    $('.layout').toggleClass('is--pushed-down is--pushed-up');
    $('.nav--toggle').toggleClass('nav--open');
    $('.nav--toggle').find('i').toggleClass('fa-bars fa-times');
  }

});
