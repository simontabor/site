(function($){$.fn.toggles=function(b){function r(e,c,f){var d=e.toggleClass("active").hasClass("active"),p=e.find(".toggle-inner").css(w);e.find(".toggle-off").toggleClass("active");e.find(".toggle-on").toggleClass("active");a.checkbox.prop("checked",d);if(!k){var b=d?0:-c+f;p.css("margin-left",b);setTimeout(function(){p.css(x);p.css("margin-left",b)},a.animate)}}b=b||{};var a=$.extend({drag:!0,click:!0,text:{on:"ON",off:"OFF"},on:!1,animate:250,transition:"ease-in-out",checkbox:null,clicker:null,width:50,height:20,
type:"compact"},b),k="select"==a.type;a.checkbox=$(a.checkbox);a.clicker&&(a.clicker=$(a.clicker));b="margin-left "+a.animate+"ms "+a.transition;var w={"-webkit-transition":b,"-moz-transition":b,transition:b},x={"-webkit-transition":"","-moz-transition":"",transition:""};return this.each(function(){var e=$(this),c=e.height(),f=e.width();if(!c||!f)e.height(c=a.height),e.width(f=a.width);var d=$('<div class="toggle-slide">'),b=$('<div class="toggle-inner">'),s=$('<div class="toggle-on">'),t=$('<div class="toggle-off">'),
h=$('<div class="toggle-blob">'),l=c/2,q=f-l;s.css({height:c,width:q,textAlign:"center",textIndent:k?"":-l,lineHeight:c+"px"}).text(a.text.on);t.css({height:c,width:q,marginLeft:k?"":-l,textAlign:"center",textIndent:k?"":l,lineHeight:c+"px"}).text(a.text.off).addClass("active");h.css({height:c,width:c,marginLeft:-l});b.css({width:2*f-c,marginLeft:k?0:-f+c});k&&(d.addClass("toggle-select"),e.css("width",2*q),h.hide());e.html(d.html(b.append(s,h,t)));d.on("toggle",function(a,b){a&&a.stopPropagation();
e.trigger("toggle",!b);r(d,f,c)});a.on&&r(d,f,c);if(a.click&&(!a.clicker||!a.clicker.has(e).length))e.on("click",function(b){(b.target!=h[0]||!a.drag)&&d.trigger("toggle",d.hasClass("active"))});if(a.clicker)a.clicker.on("click",function(b){(b.target!=h[0]||!a.drag)&&d.trigger("toggle",d.hasClass("active"))});if(a.drag&&!k){var g,u=(f-c)/4,v=function(k){e.off("mousemove");d.off("mouseleave");h.off("mouseup");var n=d.hasClass("active");!g&&a.click&&"mouseleave"!==k.type?d.trigger("toggle",n):n?g<-u?
d.trigger("toggle",n):b.animate({marginLeft:0},a.animate/2):g>u?d.trigger("toggle",n):b.animate({marginLeft:-f+c},a.animate/2)},m=-f+c;h.on("mousedown",function(a){g=0;h.off("mouseup");d.off("mouseleave");var c=a.pageX;e.on("mousemove",h,function(a){g=a.pageX-c;d.hasClass("active")?(a=g,0<g&&(a=0),g<m&&(a=m)):(a=g+m,0>g&&(a=m),g>-m&&(a=0));b.css("margin-left",a)});h.on("mouseup",v);d.on("mouseleave",v)})}})};})(jQuery);
