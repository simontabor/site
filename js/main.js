// serenity
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

$('header .expandable').on('mouseenter mouseleave',function(e) {
  e.preventDefault();
  $(this).toggleClass('expanded').find('ul').slideToggle(200);
});

$('code').on('click',function() {
  var doc = document;

  if (doc.body.createTextRange) {
    var range = doc.body.createTextRange();
    range.moveToElementText(this);
    range.select();
  } else if (window.getSelection) {
    var selection = window.getSelection();
    var range = doc.createRange();
    range.selectNodeContents(this);
    selection.removeAllRanges();
    selection.addRange(range);
  }
});
