<?php
	include_once('config.inc.php');
	session_start();
	
	$conn = new PDO("mysql:host=$DBHostName;dbname=$DBName",$DBUserName,$DBPassword);
	
	$key=$_REQUEST['key'];
	
	
	$sql="select * from cpo_prg.sites where company='$key'";
	$result=$conn->query($sql);
	$trows = $result->rowCount();
	$arr=array();
	$rec = $result->fetch(PDO::FETCH_ASSOC);
	
	
	$sql="select * from cpo_prg.sites where company!='$key'";
	$result=$conn->query($sql);
	$trows = $result->rowCount();
	$arr=array();
	while($r = $result->fetch(PDO::FETCH_ASSOC)){
	    $arr[] = "<li style='list-style: none;float:left;padding:0px 10px 0px 0px'><a href='http://".$r['website']."' target='_blank' alt='".$r['descr']."' >".$r['company']."</a></li>";
	}; 
	$link='<ul   id="jquery">';
	$links.=implode("",$arr)."</ul>";
	
	
?>

links="<?php echo $links;?>";
cont=	'<div id="panel">';
cont+='	<div class="content clearfix">';
cont+='				<div class="left">';
cont+='					<h1><?php echo strtoupper($rec['website']);?></h1>';
cont+='					<h2>Other sites on our network</h2>';		
cont+=links;
cont+='					</div>';
/*cont+='				<div class="left">';
cont+='					<!-- Login Form -->';
cont+='					<form class="clearfix" action="#" method="post">';
cont+='						<br><br><h1>Member Login</h1>';
cont+='						<label class="grey" for="log">Username:</label>';
cont+='						<input class="field" type="text" name="log" id="log" value="" size="23" />';
cont+='						<label class="grey" for="pwd">Password:</label>';
cont+='						<input class="field" type="password" name="pwd" id="pwd" size="23" />';
cont+='		            	<label><input name="rememberme" id="rememberme" type="checkbox" checked="checked" value="forever" /> &nbsp;Remember me</label>';
cont+='	        			<div class="clear"></div>';
cont+='						<input type="submit" name="submit" value="Login" class="bt_login" />';
cont+='						<a class="lost-pwd" href="#">Lost your password?</a>';
cont+='					</form>';
cont+='				</div>';*/
cont+='				<div class="left right">';			
cont+='					<!-- Register Form -->';
cont+='					<form action="#" method="post">';
cont+='						<br><br><h1>Contact Us</h1>';				
cont+='						<label class="grey" for="signup">Name:</label>';
cont+='						<input class="field" type="text" name="signup" id="signup" value="" size="23" />';
cont+='						<label class="grey" for="email">Email:</label>';
cont+='						<input class="field" type="text" name="email" id="email" size="23" />';
cont+='						<label class="grey" for="=phone_number">Phone Number:</label>';
cont+='						<input class="field" type="text" name="phone_number" id="phone_number" size="23" />';
cont+='	        			<div class="clear"></div>';
cont+='						<input type="submit" name="submit" value="Send" class="bt_register" />';
cont+='					</form>';
cont+='				</div>';
cont+='			</div>';





$(function() {
	    
	    var footer='<div id="footerSlideContainer">';
footer+='<div id="footerSlideButton" style="background-position: left top;"></div>';
footer+='<div id="footerSlideContent" ><div id="cpo_network"></div><div id="footerSlideText"></div>';
footer+='</div><div id="border_bottom"></div></div>';
	  var icons='<ul class="social" id="jquery">';
<?php if($rec['facebook']!=""){?>
icons+='<li class="facebook"><a href="<?php echo $rec['facebook'];?>"><strong>Facebook</strong></a></li>';
<?php }?>
<?php if($rec['linkedin']!=""){?>
icons+='<li class="linkedin"><a href="<?php echo $rec['linkedin'];?>" target="_blank"><strong>LinkedIn</strong></a></li>';
<?php }?>
<?php if($rec['youtube']!=""){?>
icons+='<li class="youtube"><a href="<?php echo $rec['youtube'];?>"><strong>YouTube</strong></a>';
<?php }?>
<?php if($rec['rss']!=""){?>
icons+='</li><li class="rss"><a href="<?php echo $rec['rss'];?>"><strong>RSS</strong></a></li>';
<?php }?>
<?php if($rec['tweeter']!=""){?>
icons+='<li class="twitter"><a href="<?php echo $rec['tweeter'];?>"><strong>Twitter</strong></a></li>';
<?php }?>
icons+='</ul>';
	   
	   $("body").prepend($(footer));
	   $("#cpo_network").append(cont); 
	//$("body").before(footer);
	var open = false;
	    $('#footerSlideButton').click(function() {
	        if(open === false) {
	            $('#footerSlideContent').animate({ height: '300px' });
			//	 $('#footerSlideButton').css('background', 'url(../images/bt_close.png) top left no-repeat transparent');
	            $(this).css('backgroundPosition', 'bottom left');
	            open = true;
	        } else {
	            $('#footerSlideContent').animate({ height: '40px' });
	            $(this).css('backgroundPosition', 'top left');
	     //        $('#footerSlideButton').css('background', 'url(../images/bt_open.png) top left no-repeat transparent');
	           
	            open = false;
	        }
	    });
	    
	    
	    
	    $("#jquery li").each(function() {
   $("a strong", this).css("opacity", "0");
});


 $(icons).appendTo("#footerSlideText");
 
 $("#jquery li a strong").animate({
         opacity: 0,
         top: "0px"
      }, 0);

	   //$('#footerSlideContent').css('background',cpoOptions.bgcolor);
	     
$("#jquery li").hover(function() { // Mouse over
   $(this)
      .stop().fadeTo(500, 1)
      .siblings().stop().fadeTo(500, 0.2);
        
   $("a strong", this)
      .stop()
      .animate({
         opacity: 1,
         top: "0px"
      }, 300);
     
}, function() { // Mouse out
   $(this)
      .stop().fadeTo(500, 1)
      .siblings().stop().fadeTo(500, 1);
     
   $("a strong", this)
      .stop()
      .animate({
         opacity: 0,
         top: "0px"
      }, 300);
});



	});
	

	

