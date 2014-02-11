jQuery(document).ready(function($) {
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

  // $('.nav--close').click(function(e){
  //   e.preventDefault();
  //   $('.layout').toggleClass('is--pushed-down is--pushed-up');
  //   $('.nav--toggle i').toggleClass('fa-bars fa-times');
  // });

  // var bgcol = $('.container').first().css('backgroundColor');
  // $('.nav--close').css('color',bgcol);

  // var toggle = $('.nav--toggle');
  // toggle.css({position:"fixed",top:"40px",right:"40px"});
});
