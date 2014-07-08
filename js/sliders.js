$('.slider').sliders()
  .on('change', function() {
    // console.log(arguments);
  }).on('value', function() {
    // console.log(arguments);
  });

$('#theme').on('change',function() {
  $('.examples').removeClass('slider-light slider-dark slider-iphone slider-modern slider-soft').addClass('slider-'+$(this).find('option:selected').attr('rel'));
  _gs('event','Changed Theme to ' + $(this).find('option:selected').text());
});

$('.downloads .min').on('click',function() {
  _gs('event', 'Downloaded Sliders');
});
$('.downloads .minny').on('click',function() {
  _gs('event', 'Downloaded Minified Sliders');
});
