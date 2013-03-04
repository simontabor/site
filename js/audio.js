/* crappy browser checks */
if ((typeof Audio != 'function') || (typeof FileReader != 'function')) {
  $('div[role="main"]').text('Sorry, your browser doesn\'t support HTML5 features used here. Please upgrade to Chrome.').css('textAlign','center');
}
if (!Modernizr.inputtypes.range) {
  console.log('no ranges!!!');
  $('#seek').css('opacity','0');
  $('#vol').css('opacity','0');
}
/* end browser checks */
/* globals */
var player = $('#player'), 
seek=$('#seek'), vol=$('#vol'), 
volumec = $('#volume',vol), 
stop = $('#stop'), 
autoplay=true, 
playpause = $('#playpause',player), 
autotoggle=$('#autoplay'),
nowplay = {},
index = 0,
song, 
songs = [], 
updates = 0,
percentLoaded = 0;
nowplay.c = $('#nowplaying'), 
nowplay.title= $('.title', nowplay.c), 
nowplay.artist = $('.artist',nowplay.c), 
nowplay.album = $('.album',nowplay.c), 
nowplay.year= $('.year',nowplay.c), 
nowplay.art = $('.art',nowplay.c),


autotoggle.live('click',function() {
  if (autotoggle.hasClass('active')) {
    autotoggle.removeClass('active');
    autoplay = false;
  }else{
    autotoggle.addClass('active');
    autoplay = true;
  }
});

seek.on('change',function() {
  song.currentTime= $(this).attr('value');
  seek.attr('max', song.duration);
});

volumec.on('change',function() {
  song.volume = ($(this).attr('value') -1) / 10;
  if (song.volume > 0.7) {
    vol.css('backgroundPosition','-11px -56px');
  }
  if (song.volume < 0.1) {
    vol.css('backgroundPosition','-91px -56px');
  }
  if ((song.volume <= 0.7) && (song.volume >= 0.1))  {
    vol.css('backgroundPosition','-51px -56px');
  }
});

stop.on('click',function() {
  song.pause();
  song.currentTime= 0;
  playpause.removeClass('playing');
});

playpause.on('click',function() {
  if (song.paused) {
    song.play();
    playpause.addClass('playing');
  }else{
    song.pause();
    playpause.removeClass('playing');
  }
});

vol.on('mouseenter',function() {
  volumec.fadeIn(200);
});

vol.on('mouseleave', function() {
  volumec.fadeOut(200);
});

function nowPlaying(p) {
  nowplay.title.text(songs[p].meta.title);
  nowplay.artist.text(songs[p].meta.artist);
  nowplay.album.text(songs[p].meta.album);
  nowplay.year.text(songs[p].meta.year);
  $.getJSON('http://api.discogs.com/database/search?callback=?&title&q='+songs[p].meta.artist+' - '+songs[p].meta.album, function (data) {
    if ((data.data.results[0]) || (data.data.results[0].title.search(songs[p].meta.artist) !== -1)) {
      nowplay.art.attr({'src':data.data.results[0].thumb, 'title': songs[p].meta.artist+' - '+songs[p].meta.album});
    }
  });
}

function playnext() {
  var reader = new FileReader();
  reader.onprogress = updateProgress;
  reader.onloadstart = function(e) {
    $('#playlist .loaded').text('');
  };
  reader.onload = function(e) {
    $($('#playlist .loaded')[index]).text('100%');
    console.log('complete');   
    song.pause();
    song.currentTime = 0;
    playerinit(e.target.result, songs[index].type);
    playpause.addClass('playing');
    song.play();
  };
  if (songs[index+1] !== undefined) {
    index++;
    nowPlaying(index);
    reader.readAsDataURL(songs[index]);
    $($('#playlist li').removeClass('active').get(index)).addClass('active');
  }
}

$('#playlist li').live('click', function() {
  if (!$(this).hasClass('songs')) {
    playpause.removeClass('playing');
    var newindex = $('#playlist li').index(this);
    if (newindex != index) {
      index = newindex;
      $('#playlist li').removeClass('active');
      $(this).addClass('active'); 
      nowPlaying(index);
      var reader = new FileReader();
      reader.onprogress = updateProgress;
      console.log(index);
      reader.onloadstart = function(e) {
        $('#playlist .loaded').text('');
      };
      reader.onload = function(e) {
        $($('#playlist .loaded')[index]).text('100%');
        console.log('complete');   
        song.pause();
        song.currentTime = 0;
        playerinit(e.target.result, songs[index].type);
        playpause.addClass('playing');
        song.play();
      };
      reader.readAsDataURL(songs[index]);    
    }
  }
});

function playerinit(songdata, songtype) {
  $('audio').remove();
  song = [];
  song = new Audio(songdata);
  song.addEventListener('timeupdate',function (){
    current = parseInt(song.currentTime, 10);
    perc = current/song.duration * 100;
    seek.attr('value',song.currentTime);
    seek.attr('max', song.duration);
  });
  song.addEventListener('ended',function() {
    song.currentTime=0;
    playpause.removeClass('playing');
    if (autoplay) {
      playnext();
    }

  });
  song.volume = 0.9;
}
function updateList(songlist) {

}
function updateProgress(evt) {
  if (evt.lengthComputable) {
    percentLoaded = Math.round((evt.loaded / evt.total) * 100);
    if (percentLoaded < 100) {
      $($('#playlist .loaded')[index]).text(percentLoaded+'%');
    }
  }
}
function filechanged(files) {
  function getMetaData(i) {
    if (!songs[i].meta) {
      var metad = songs[i].slice(songs[i].size-128);
      var metareader = new FileReader();
      metareader.onload = function(e) {
        var metadata = e.target.result;
        if (~metadata.indexOf('TAG')) {
          metadata = metadata.substr(3, metadata.length-3);
          songs[i].meta = {};
          songs[i].meta.title = metadata.substr(0,30);
          songs[i].meta.artist = metadata.substr(30,30);
          songs[i].meta.album = metadata.substr(60,30);
          songs[i].meta.year = metadata.substr(90,4);
          if (i == index) {
            $('#playlist').append('<li class="active">'+songs[i].meta.title+' - '+songs[i].meta.artist+' <span class="loaded">'+percentLoaded+'%</span></li>');
          }else {
            $('#playlist').append('<li>'+songs[i].meta.title+' - '+songs[i].meta.artist+' <span class="loaded"></span></li>');
          }

        }else{
          songs[i].meta = {};
          songs[i].meta.title = songs[i].name;
          if (i == index) {
            $('#playlist').append('<li class="active">'+songs[i].name+'<span class="loaded">'+percentLoaded+'%</span></li>');
          }else {
            $('#playlist').append('<li>'+songs[i].name+' <span class="loaded"></span></li>');
          }

        }
        if (j+1 < songs.length) {
          j++;
          getMetaData(j);
        }else{
          nowPlaying(index);
          $('#playlist').removeClass('loading').append('<li class="songs"><input style="opacity:0" type="file" id="choosefiles" multiple /></li>');
        }
      };
      metareader.readAsBinaryString(metad);
    }else{
      if (i == index) {
        $('#playlist').append('<li class="active">'+songs[i].meta.title+' - '+songs[i].meta.artist+' <span class="loaded">'+percentLoaded+'%</span></li>');
      }else {
        $('#playlist').append('<li>'+songs[i].meta.title+' - '+songs[i].meta.artist+' <span class="loaded"></span></li>');
      }
      if (j+1 < songs.length) {
        j++;
        getMetaData(j);
      }else{
        nowPlaying(index);

        $('#playlist').removeClass('loading').append('<li class="songs"><input style="opacity:0" type="file" id="choosefiles" multiple /></li>');
      }
    }
  }
  var oldlength = songs.length;
  console.log(files);
  for (var i = 0; i< files.length; i++) {
    if (files[i].type == 'audio/mp3') {
      songs.push(files[i]);
    }
  }   
  var i = 0, j = 0;
  if (songs.length > oldlength) {
    $('#playlist').addClass('loading').html('');
  }
  getMetaData(0);
  if (songs.length > 0) {
    $('#playlist').css('marginTop','30px');
    if (updates === 0) {
      player.css('opacity','1');

      var reader = new FileReader();
      reader.onprogress = updateProgress;
      reader.onload = function(e) {
        $($('#playlist li')[0]).addClass('active');
        $($('#playlist .loaded')[0]).text('100%');
        playerinit(e.target.result, songs[0].type);
      };
      reader.readAsDataURL(songs[0]);    
    }
  }
  if (songs.length > 1) {
    autotoggle.css('opacity','1');
  }
  updates++;
}
$('#choosefiles').on('change',function(e) {
  var files = e.target.files;
  filechanged(files);
});
