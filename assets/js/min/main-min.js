$(function(){function t(){var t=document;return Math.max(t.body.scrollHeight,t.documentElement.scrollHeight,t.body.offsetHeight,t.documentElement.offsetHeight,t.body.clientHeight,t.documentElement.clientHeight)}function i(){var t=$(".bullet");if(t.size()>0){$("body").append('<div class="bullet-navigation bullet-navigation--sticky"><ul></ul></div>');var i=$(".bullet-navigation ul");t.each(function(t){var n=$(this).attr("id");void 0===n&&(n="bull_"+t,$(this).attr("id",n));var e=$(this).find("h1,h2,h3,h4,h5,h6").first().text();i.append('<li id="b_'+n+'" title="'+e+'"><a href="#'+n+'"></a></li>')})}n()}function n(){var t=$(".bullet");if(t.size()>0){var i=t.offset();u+r/2.5>=i.top?($(".bullet-navigation").addClass("bullet-navigation--sticky"),t.each(function(){var t=$(this).offset();if(u+r/2.5>=t.top){var i=$(this).attr("id");$(".bullet-navigation ul li").removeClass("active"),$("#b_"+i).addClass("active")}})):($(".bullet-navigation ul li").removeClass("active"),$(".bullet-navigation").removeClass("bullet-navigation--sticky"))}}function e(){200>=u?o():u+r===v&&a(),h>=30?a():b>=30&&o()}function o(){h=b=0,$("body").hasClass("nav--fixed")&&$("header").slideUp("slow",function(){$(this).removeClass("js-active").removeAttr("style"),$("body").removeClass("nav--fixed")})}function a(){h=b=0,$("body").hasClass("nav--fixed")||($("body").addClass("nav--fixed"),$("header").slideDown("slow",function(){$(this).addClass("js-active").removeAttr("style")}))}function l(){f>u?(h++,b=0):(b++,h=0),f=u,d(),n()}function s(){c()}function c(){$(".content").css("margin-bottom",$("footer").outerHeight())}function d(){u>=600?$(".backToTop").fadeIn():$(".backToTop").fadeOut()}var r=$(window).height(),u=$(window).scrollTop(),v=t(),f=0,h=0,b=0;$(".bullet-navigation").on("click","a",function(){var t=$(this.hash);return t=t.length?t:$("[name="+this.hash.slice(1)+"]"),t.length?($("html,body").animate({scrollTop:t.offset().top},1e3),!1):void 0}),window.addEventListener("scroll",function(){u=$(window).scrollTop(),l()},!0),window.addEventListener("touchmove",function(){u=$(this).scrollTop(),l()},!0),window.addEventListener("resize",function(){s()},!0);var g=0,m=0,p=$(".bg--animated");p.css("backgroundPosition",g+"px "+m+"px"),window.setInterval(function(){p.css("backgroundPosition",g+"px "+m+"px"),g-=5},200),$(".backToTop").click(function(t){$("html, body").animate({scrollTop:0},300),t.preventDefault()}),i(),s()});