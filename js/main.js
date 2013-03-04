var GoSquared={};
GoSquared.acct = "GSN-757634-O";
(function(w){
    function gs(){
        w._gstc_lt=+(new Date); var d=document;
        var g = d.createElement("script"); g.type = "text/javascript"; g.async = true; g.src = "//d1l6p2sc9645hc.cloudfront.net/tracker.js";
        var s = d.getElementsByTagName("script")[0]; s.parentNode.insertBefore(g, s);
    }
    w.addEventListener?w.addEventListener("load",gs,false):w.attachEvent("onload",gs);
})(window);

$('header .expand').on('click',function() {
  var h = $('header').toggleClass('expanded');

  var animate = {
    '-webkit-transition':'height .2s ease-out',
    '-moz-transition':'height .2s ease-out',
    'transition':'height .2s ease-out'
  };
  if (!h.hasClass('expanded')) {
    h.css(animate).height('');
  } else {
    var preheight = h.height();
    var height = h.css({
      '-webkit-transition':'',
      '-moz-transition':'',
      'transition':''
    }).height('auto').height();
    h.height(preheight).css(animate).height(height);
  }
});

$('header .slideycont').on('click',function(e) {
  e.preventDefault();
  $(this).closest('li').toggleClass('expanded').find('ul').slideToggle(200);
});