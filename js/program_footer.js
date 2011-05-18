

$(function() {
	    
	    var footer='<div id="footerSlideContainer"><div id="footerSlideButton" style="background-position: left top;"></div><div id="footerSlideContent" style="height: 60px;"><div id="footerSlideText"></div></div></div>';
	    
	    var icons='<ul class="social" id="jquery"><li class="facebook"><a href="http://www.facebook.com/"><strong>Facebook</strong></a></li><li class="flickr"><a href="http://www.flickr.com/"><strong>Flickr</strong></a></li><li class="linkedin"><a href="http://www.linkedin.com/"><strong>YouTube</strong></a></li><li class="rss"><a href="http://feeds2.feedburner.com/marcofolio"><strong>RSS</strong></a></li><li class="twitter"><a href="http://twitter.com/"><strong>Twitter</strong></a></li></ul>';
	   
	    $(footer).appendTo($("body")); 
	
	var open = false;
	    $('#footerSlideButton').click(function() {
	        if(open === false) {
	            $('#footerSlideContent').animate({ height: '300px' });
	            $(this).css('backgroundPosition', 'bottom left');
	            open = true;
	        } else {
	            $('#footerSlideContent').animate({ height: '60px' });
	            $(this).css('backgroundPosition', 'top left');
	            open = false;
	        }
	    });
	    
	    
	    $("#jquery li").each(function() {
   $("a strong", this).css("opacity", "0");
});


 $(icons).appendTo("#footerSlideText");
 
 $("#jquery li a strong").animate({
         opacity: 0,
         top: "-1px"
      }, 0);
  
$("#jquery li").hover(function() { // Mouse over
   $(this)
      .stop().fadeTo(500, 1)
      .siblings().stop().fadeTo(500, 0.2);
        
   $("a strong", this)
      .stop()
      .animate({
         opacity: 1,
         top: "-10px"
      }, 300);
     
}, function() { // Mouse out
   $(this)
      .stop().fadeTo(500, 1)
      .siblings().stop().fadeTo(500, 1);
     
   $("a strong", this)
      .stop()
      .animate({
         opacity: 0,
         top: "-1px"
      }, 300);
});



	});
	

	

