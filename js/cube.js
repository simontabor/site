// serenity
var prefix;
$(function () {
  var prefixes = ['','-o-','-webkit-','-moz-'];

  for (var i in prefixes) {
    var thistransform = $('#cube').css(prefixes[i]+'transform');
    if (thistransform) {
      prefix = prefixes[i];
      break;
    }

  }
});
var scale = 0.8, sensitivity = 5, opacity = 0.4, red=222,green=222,blue=222;


var indexy = 0;
$('p.cubenav a').on('click',function() {
  indexy = $('p.cubenav a').removeClass('active').index(this);
  var classy = $(this).attr('class');
  $('#cube').removeClass('spinny');
  $('a.spin').removeClass('active').text('Send me spinning!');
  $('#cube').attr('style','').removeClass().addClass(classy);
  $(this).addClass('active');
});
$('input[name=sensitivity]').on('change',function() {
  val = $(this).val();
  $('p.sensitivity').text(val);
  sensitivity = val;
});
$('input[name=color]').on('change',function() {
  var color = $(this).val();
  red = parseInt(color.substring(1, 3), 16),
  green = parseInt(color.substring(3, 5), 16),
  blue = parseInt(color.substring(5, 7), 16);
  $('figure').css({
    'background':'rgba('+red+','+green+','+blue+','+opacity+')',
    'border-color':color
  });
});
$('input[name=opacity]').on('change',function() {
  var value = $(this).val();
  opacity = value/10;
  $('figure').css('background','rgba('+red+','+green+','+blue+','+opacity+')');
  $('p.opacity').text(opacity);
});
$('input[name=scale]').on('change',function() {
  var value = $(this).val();
  scale = value/10;
  $('p.scale').text(scale);
  $('section').css(prefix+'transform','scale3d('+scale+','+scale+','+scale+')');

});

$('section.cubey').on('mousedown',function (f) {
  f.preventDefault();
  $('#cube').removeClass('spinny');
  $('a.spin').removeClass('active').text('Send me spinning!');
  $('p.cubenav a').removeClass('active');
  var initialy = f.pageY, initialx = f.pageX,movetime,diffx=0,diffy=0,oldx,oldy;
  $('#cube').css(prefix+'transition','none');


  $(document).on('mousemove',function (e) {
    oldx= diffx;
    oldy = diffy;
    diffy = e.pageY - initialy;
    diffx = e.pageX - initialx ;
    movetime = new Date().getTime();
    var movethisx = diffx*sensitivity/6,
    movethisy = (-1)*diffy*sensitivity/6;

    $('#cube').css(prefix+'transform','translateZ( -275px ) rotateY('+movethisx+'deg) rotateX('+movethisy+'deg)');

  });


  $(document).on('mouseup',function () {
    $('#cube').css(prefix+'transition',prefix+'transform 1s');
    $(document).off('mouseup mousemove');
    var timediff = new Date().getTime() - movetime,
    speedy = ((diffy-oldy)*sensitivity/6) / timediff,
    speedx = ((diffx-oldx)*sensitivity/6) / timediff;
    // pixels moved in the last ms (probably)
    if (isNaN(speedy)) {
      speedy=0;
    }
    if (isNaN(speedx)) {
      speedx=0;
    }
    //animate the cube to rotate at the speeds, decelerating nicely for a certain time. LOLWUT
    var rotatemey = (-1)*(diffy*sensitivity/6)+speedy, rotatemex = (diffx*sensitivity/6)+speedx;
    $('#cube').css(prefix+'transform','translateZ( -275px ) rotateY('+rotatemex+'deg) rotateX('+rotatemey+'deg)');
  });
});
$('a.spin').on('click',function() {
  var cubenava = $('p.cubenav a');
  if ($(this).hasClass('active')) {
    $('#cube').removeClass('spinny');
    $(this).removeClass('active').text('Send me spinning!');
    $(cubenava[indexy]).addClass('active');
  }else {
    $('#cube').addClass('spinny');
    $(this).addClass('active').text('I\'m spinning!');
    $('p.cubenav a').removeClass('active');
  }
});

if (!Modernizr.inputtypes.color) {
 $('div.colors').hide();
}
if (!Modernizr.inputtypes.range) {
  $('div.sensitivity').hide();
}
if (!Modernizr.csstransforms3d) {
  $('#cube').html('<p style="text-align:center">Your browser doesn\'t support CSS 3D Transforms... upgrade?</p>');
}
