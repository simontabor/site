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