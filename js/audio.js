// serenity
// crappy browser checks
$(function() {

  if ((typeof Audio != 'function') || (typeof FileReader != 'function')) {
    $('#audio').text('Sorry, your browser doesn\'t support HTML5 features used here. Please upgrade to Chrome.').css('textAlign','center');
  }

  // elements and defaults
  var
  currentSong,
  player = $('#player'),
  seek = $('#seek'),
  vol = $('#vol'),
  volumec = vol.find('#volume'),
  stop = $('#stop'),
  autoplay = true,
  playpause = player.find('#playpause'),
  autotoggle=$('#autoplay'),
  index = 0,
  songs = [],
  updates = 0,
  percentLoaded = 0,
  volume = 0.9,
  nowplay = {};

  nowplay.c = $('#nowplaying');
  nowplay.title= nowplay.c.find('.title');
  nowplay.artist = nowplay.c.find('.artist');
  nowplay.album = nowplay.c.find('.album');
  nowplay.year= nowplay.c.find('.year');
  nowplay.art = nowplay.c.find('.art');

  if (!Modernizr.inputtypes.range) {
    seek.remove();
    vol.remove();
  }

  var readSong = function(play) {
    var pro = $('#playlist .loaded').eq(index);

    var reader = new FileReader();
    reader.onprogress = function(evt) {
      if (!evt.lengthComputable) return;
      percentLoaded = Math.round((evt.loaded / evt.total) * 100);
      if (percentLoaded < 100) {
        pro.text(percentLoaded+'%');
      }
    };
    reader.onloadstart = function(e) {
      $('#playlist .loaded').text('');
    };
    reader.onload = function(e) {
      pro.text('100%');
      if (currentSong) currentSong.destroy();
      currentSong = new song(e.target.result, songs[index]);
      if (play) currentSong.play();
    };
    reader.readAsDataURL(songs[index]);
    $('#playlist li').removeClass('active').eq(index).addClass('active');
  };



  var song = function(data,dasong) {
    var self = this;

    self.audio = new Audio(data);
    self.song = dasong;

    self.audio.addEventListener('timeupdate',function (){
      var current = +song.currentTime;
      var perc = current/song.duration * 100;
      seek.val(self.audio.currentTime);
      seek.attr('max', self.audio.duration);
    });

    self.audio.addEventListener('ended',function() {
      self.audio.currentTime=0;
      playpause.removeClass('playing');
      if (autoplay) {
        playnext();
      }
    });

    seek.attr('max',self.audio.duration);
    self.volume(volume);
    self.meta();
  };
  song.prototype.volume = function(vol) {
    var self = this;

    if (typeof vol == 'undefined') return self.audio.volume;

    // update global
    volume = vol;

    self.audio.volume = vol;
  };
  song.prototype.play = function() {
    var self = this;

    self.audio.play();
    playpause.addClass('playing');
  };
  song.prototype.pause = function() {
    var self = this;

    self.audio.pause();
    playpause.removeClass('playing');
  };
  song.prototype.stop = function() {
    var self = this;

    self.pause();
    self.seek(0);
  };
  song.prototype.playPause = function() {
    var self = this;

    if (self.audio.paused) {
      self.play();
    }else{
      self.pause();
    }
  };

  song.prototype.seek = function(time) {
    var self = this;

    if (typeof time == 'undefined') return self.audio.currentTime;

    if (time == self.seek()) return;
    self.audio.currentTime = time;

    // just to be sure
    seek.attr('max', self.audio.duration);
  };


  song.prototype.meta = function() {
    var self = this;

    if (!self.song.meta) return;
    nowplay.title.text(self.song.meta.title);
    nowplay.artist.text(self.song.meta.artist);
    nowplay.album.text(self.song.meta.album);
    nowplay.year.text(self.song.meta.year);
    $.getJSON('http://api.discogs.com/database/search?callback=?&title&q='+self.song.meta.artist+' - '+self.song.meta.album, function (data) {
      if ((data.data.results[0]) || (data.data.results[0].title.search(self.song.meta.artist) !== -1)) {
        nowplay.art.attr({
          'src':data.data.results[0].thumb,
          'title': self.song.meta.artist+' - '+self.song.meta.album
        });
      }
    });
  };
  song.prototype.destroy = function() {
    var self = this;
    self.audio = null;
    self.song = null;
  };


  autotoggle.on('click',function() {
    if (autotoggle.hasClass('active')) {
      autotoggle.removeClass('active');
      autoplay = false;
    }else{
      autotoggle.addClass('active');
      autoplay = true;
    }
  });



  seek.on('change',function() {
    currentSong.seek($(this).val());
  });

  volumec.on('change',function() {
    currentSong.volume(($(this).val() -1) / 10);

    var cv = currentSong.volume();
    if (cv > 0.7) {
      vol.css('backgroundPosition','-11px -56px');
    }
    if (cv < 0.1) {
      vol.css('backgroundPosition','-91px -56px');
    }
    if ((cv <= 0.7) && (cv >= 0.1))  {
      vol.css('backgroundPosition','-51px -56px');
    }
  });

  stop.on('click',function() {
    currentSong.stop();
  });

  playpause.on('click',function() {
    currentSong.playPause();
  });

  vol.on('mouseenter',function() {
    volumec.fadeIn(200);
  });

  vol.on('mouseleave', function() {
    volumec.fadeOut(200);
  });

  var playnext = function() {
    if (songs[index+1]) {
      index++;
      readSong(true);
    }
  };

  $('#playlist').on('click','li', function() {

    if ($(this).hasClass('songs')) return;

    if (currentSong) currentSong.stop();

    var newindex = $('#playlist li').index(this);
    if (newindex != index) {
      index = newindex;
      $('#playlist li').removeClass('active');
      $(this).addClass('active');

      readSong(true);
    }
  });

  var filechanged = function(files) {

    var getMetaData = function(i) {
      if (!songs[i].meta) {
        var metad = songs[i].slice(songs[i].size-128);
        var metareader = new FileReader();
        metareader.onload = function(e) {
          var metadata = e.target.result;
          if (metadata.indexOf('TAG') !== -1) {
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
            // no meta :(
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
            if (!currentSong) readSong();
            $('#playlist').removeClass('loading').append('<li class="songs"><input style="opacity:0" type="file" id="choosefiles" multiple /></li>');
          }
        };
        metareader.readAsBinaryString(metad);
      } else {
        // already got meta
        if (i == index) {
          $('#playlist').append('<li class="active">'+songs[i].meta.title+' - '+songs[i].meta.artist+' <span class="loaded">'+percentLoaded+'%</span></li>');
        }else {
          $('#playlist').append('<li>'+songs[i].meta.title+' - '+songs[i].meta.artist+' <span class="loaded"></span></li>');
        }
        if (j+1 < songs.length) {
          j++;
          getMetaData(j);
        }else{
          if (!currentSong) readSong();

          $('#playlist').removeClass('loading').append('<li class="songs"><input style="opacity:0" type="file" id="choosefiles" multiple /></li>');
        }
      }
    };

    var oldlength = songs.length;

    for (var i = 0; i < files.length; i++) {
      if (files[i].type == 'audio/mp3') {
        songs.push(files[i]);
      }
    }
    var i = 0, j = 0;
    $('#playlist').empty();
    getMetaData(0);
    if (songs.length > 0) {
      $('#playlist').css('marginTop','30px');
      if (updates === 0) {
        player.css('opacity','1');
        index = 0;
        readSong();
      }
    }
    if (songs.length > 1) {
      autotoggle.css('opacity','1');
    }
    updates++;
  };





  $('#playlist').on('change','#choosefiles',function(e) {
    var files = e.target.files;
    filechanged(files);
  });
});
