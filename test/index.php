<!DOCTYPE html>
<html>
<head>
  <style>img{ height: 100px; float: left; }</style>
  <script src="http://code.jquery.com/jquery-latest.js"></script>
 <script src="../js/jquery.xdomainajax.js"></script>

</head>
<body>
  <div id="images">

</div>
<script>
$('#container').load('http://google.com'); // SERIOUSLY!

/*$.get('json2.php?DB=jpreport&SQL=select * from jp_dc', function(data) {
 
  alert('Load was performed.');
});
 */
$.ajax({
    url: 'http://localhost/jpreport/json2.php?DB=jpreport&SQL=select * from jp_dc',
    type: 'GET',
	dataType:'json',
    success: function(res) {
       
       console.log(res);
    }
});
  </script>

</body>
</html>