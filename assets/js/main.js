$(function() {
  // Document Height Crossbrowser Fix
  function getDocHeight() {
    var D = document;
    return Math.max(
      D.body.scrollHeight, D.documentElement.scrollHeight,
      D.body.offsetHeight, D.documentElement.offsetHeight,
      D.body.clientHeight, D.documentElement.clientHeight
    );
  }

  // Window, Document
  var wHeight = $( window ).height(),
      wScrollTop = $( window ).scrollTop(),
      dHeight = getDocHeight();

  // Scroll Helpers
  var lastScroll = 0,
      scrollUp = 0,
      scrollDown = 0;

  // DEBOUNCE HELPER
  // function debounce(fn, delay) {
  //   var timer = null;
  //   return function () {
  //     var context = this, args = arguments;
  //     clearTimeout(timer);
  //     timer = setTimeout(function () {
  //       fn.apply(context, args);
  //     }, delay);
  //   };
  // }



  // BULLET NAVIGATION
  function initBulletNavigation(){
    var $bullets = $('.bullet');
    if ( $bullets.size() > 0 ){
      $('body').append('<div class="bullet-navigation bullet-navigation--sticky"><ul></ul></div>');
      var $navigation = $('.bullet-navigation ul');

      $bullets.each( function( index ){
        var bullId = $(this).attr('id');
        if (bullId === undefined){
          bullId = 'bull_' + index;
          $(this).attr('id',bullId);
        }
        var bullTitle = $(this).find('h1,h2,h3,h4,h5,h6').first().text();
        $navigation.append('<li id="b_'+ bullId +'" title="'+ bullTitle +'"><a href="#' + bullId + '"></a></li>');
      });
    }
    updateBulletNavigation();
  }
  /**
   * BULLET NAVIGATION
   */
  function updateBulletNavigation(){
    var $bullets = $('.bullet');
    if ( $bullets.size() > 0 ){
      var goffset = $bullets.offset();
      if ( (wScrollTop + (wHeight / 2.5))  >= goffset.top ){
        $('.bullet-navigation').addClass('bullet-navigation--sticky');
        $bullets.each( function(){
          var offset = $(this).offset();
          if ( (wScrollTop + (wHeight / 2.5)) >= offset.top ){
            var bullId = $(this).attr('id');
            $('.bullet-navigation ul li').removeClass('active');
            $('#b_'+bullId).addClass('active');
          }
        });
      }else{
        $('.bullet-navigation ul li').removeClass('active');
        $('.bullet-navigation').removeClass('bullet-navigation--sticky');
      }
    }
  }

  /**
   * BULLET ANCHOR HANDLER
   */
  $('.bullet-navigation').on('click','a',function(){
    var target = $(this.hash);
    target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
    if (target.length) {
      $('html,body').animate({
        scrollTop: target.offset().top
      }, 1000);
      return false;
    }
  });

  function updateStickyNavigation(){
    if (wScrollTop <= 200){
      hideNav();
    }else if (wScrollTop + wHeight === dHeight){
      showNav();
    }
    if (scrollUp >= 30){
      showNav();
    }else if (scrollDown >= 30){
      hideNav();
    }
  }

  function hideNav(){
    scrollUp = scrollDown = 0;
    if ( $('body').hasClass('nav--fixed') ){
        $('header').slideUp('slow',function(){
          $(this).removeClass('js-active').removeAttr('style');
          $('body').removeClass('nav--fixed');
        });
      }
  }

  function showNav(){
    scrollUp = scrollDown = 0;
    if ( ! $('body').hasClass('nav--fixed') ){
        $('body').addClass('nav--fixed');
        $('header').slideDown('slow',function(){
          $(this).addClass('js-active').removeAttr('style');
        });
      }
  }

  /**
   * GLOBAL SCROLL FUNCTION
   */
  window.addEventListener('scroll', function (){
    wScrollTop = $( window ).scrollTop();
    globalScroll();
  }, true);

  // Touch Scroll Event Handler
  window.addEventListener('touchmove', function() {
    wScrollTop = $(this).scrollTop();
    globalScroll();
  }, true);

  function globalScroll(){
    if (lastScroll > wScrollTop){
      // Scrolling up
      scrollUp++;
      scrollDown = 0;
    }else{
      // Scrolling down
      scrollDown++;
      scrollUp = 0;
    }
    lastScroll = wScrollTop;

    backToTop();
    updateBulletNavigation();
    //updateStickyNavigation();
  }

  window.addEventListener('resize', function (){
    globalResize();
  }, true);

  function globalResize(){
    // Sticky Footer
    stickyFooter();
  }

  function stickyFooter(){
    $('.content').css('margin-bottom', $('footer').outerHeight() );
  }


  // ANIMATE BACKGROUND IMAGES
  var x = 0,
      y = 0;
  var animatedBg = $(".bg--animated");
  animatedBg.css('backgroundPosition', x + 'px' + ' ' + y + 'px');
  window.setInterval(function() {
      animatedBg.css("backgroundPosition", x + 'px' + ' ' + y + 'px');
      x=x-5;
  }, 200);

  // BACK TO TOP ARROW
  function backToTop(){
    if ( wScrollTop >= 600) {
        $('.backToTop').fadeIn();
    } else {
        $('.backToTop').fadeOut();
    }
  }
  $('.backToTop').click(function(e){
    $('html, body').animate({scrollTop : 0},300);
    e.preventDefault();
  });


  /**
   * INITIATE
   */
  initBulletNavigation();
  globalResize();

});
