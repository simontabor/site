$('.toggle').each(function() {
  $(this).toggles({
    clickable: !$(this).hasClass('noclick'),
    dragable: !$(this).hasClass('nodrag'),
    click: ($(this).attr('rel')) ? $('.'+$(this).attr('rel')) : null,
    on: !$(this).hasClass('off'),
    checkbox: ($(this).data('checkbox')) ? $('.'+$(this).data('checkbox')) : null,
    ontext: $(this).data('ontext') || 'ON',
    offtext: $(this).data('offtext') || 'OFF'
  });
});

$('#theme').change(function() {
  $('.examples').removeClass('light dark iphone').addClass($(this).find('option:selected').attr('rel'));
  GoSquared.q.push(['TrackEvent','Changed Theme to '+$(this).find('option:selected').text(), {}]);
});
function selectText(element) {
  var doc = document;
  var text = element;

  if (doc.body.createTextRange) {
    var range = doc.body.createTextRange();
    range.moveToElementText(text);
    range.select();
  } else if (window.getSelection) {
    var selection = window.getSelection();
    var range = doc.createRange();
    range.selectNodeContents(text);
    selection.removeAllRanges();
    selection.addRange(range);
  }
}
$('code').click(function() {
  selectText(this);
});