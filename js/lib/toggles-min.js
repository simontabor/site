(function(e){e.fn.toggles=function(l){l=l||{};var b=e.extend({dragable:!0,clickable:!0,ontext:"ON",offtext:"OFF",on:!0,animtime:300},l),h="margin-left "+b.animtime/1E3+"s ease-in-out",p={"-webkit-transition":h,"-moz-transition":h,transition:h},q={"-webkit-transition":"","-moz-transition":"",transition:""};return this.each(function(){function h(e){c.off("mousemove");g.off("mouseleave");j.off("mouseup");0!==f?g.hasClass("active")?f<(-d+a)/4?c.trigger("toggle",!g.hasClass("active")):k.animate({marginLeft:0},
b.animtime/2):f>(d-a)/4?c.trigger("toggle",!g.hasClass("active")):k.animate({marginLeft:-d+a},b.animtime/2):b.clickable&&"mouseleave"!=e.type&&c.trigger("toggle",!g.hasClass("active"))}var c=e(this);b.click=l.click||c;var a=c.height(),d=c.width();if(0===a||0===d)c.height(a=20),c.width(d=50);var g=e('<div class="slide" />'),k=e('<div class="inner" />'),m=e('<div class="on" />'),n=e('<div class="off" />'),j=e('<div class="blob" />');m.css({height:a,width:d-a/2,textAlign:"center",textIndent:-a/2,lineHeight:a+
"px"}).text(b.ontext);n.css({height:a,width:d-a/2,marginLeft:-a/2,textAlign:"center",textIndent:a/2,lineHeight:a+"px"}).text(b.offtext);j.css({height:a,width:a,marginLeft:-a/2});k.css({width:2*d-a,marginLeft:b.on?0:-d+a});b.on&&(g.addClass("active"),b.checkbox&&e(b.checkbox).attr("checked",!0));c.html("");c.append(g.append(k.append(m,j,n)));var f=0;c.on("toggle",function(){var c=g,f=d,j=a,h=c.find(".inner");h.css(p);var k=c.toggleClass("active").hasClass("active");h.css({marginLeft:k?0:-f+j});b.checkbox&&
e(b.checkbox).attr("checked",k);setTimeout(function(){h.css({marginLeft:k?0:-f+j});h.css(q)},b.animtime)});b.clickable&&b.click.click(function(a){(a.target!=j[0]||!b.dragable)&&c.trigger("toggle",!g.hasClass("active"))});if(b.dragable)j.on("mousedown",function(b){f=0;j.off("mouseup");g.off("mouseleave");var e=b.pageX;c.on("mousemove",j,function(b){f=b.pageX-e;g.hasClass("active")?k.css({marginLeft:0>f?f<-d+a?-d+a:f:0}):k.css({marginLeft:0<f?f>d-a?0:f-d+a:-d+a})});j.on("mouseup",h);g.on("mouseleave",
h)})})}})(jQuery);