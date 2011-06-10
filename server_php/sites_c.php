<?php
include_once('config.inc.php');
session_start();

$conn = new PDO("mysql:host=$DBHostName;dbname=$DBName",$DBUserName,$DBPassword);
/*$q=$conn->prepare("insert into sites (company,website) values (?,?)");
$q->execute(array('acme 2',' d a d ad a dasd a da'));
exit();
*/
$action=$_REQUEST['action'];
$id=$_REQUEST['id'];

$data=json_decode($_REQUEST['data'],true);

function json($sql){
	global $conn;
	$result=$conn->query($sql);
	$trows = $result->rowCount();
	$arr=array();
	while($rec = $result->fetch(PDO::FETCH_ASSOC)){
	    $arr[] = $rec;
	}; 
	$data = json_encode($arr); 
	echo '{"total":"'.$trows.'","results":' . $data . '}';

} 

function validate(){
	$Err="";
	if(mysql_error()) $Err=" Save Error ";
	if ($Err == "") {
		
		$result = "{success: true}"; 
	
	} else {
		
		$result = '{success: false}'; 
	}
	return $result;
}
/**
 * Save a record into a table
 * @param id: 0 insert !=0 update
 * @param data:associative array field_name=>value
 */
function save($id,$data){
	global $conn;
	
	//print_r($conn);
	$fields=implode(",",array_keys($data));
	$values=array_values($data);
		
	$pa=array_fill(0,sizeof($data),"?"); // create a ? for each field
	$param=implode(",",$pa);
	if ($id==0){ //new
		
		$sql="insert into sites ($fields) values ($param)";
		//echo $sql;
		$q=$conn->prepare($sql);
		
		$q->execute($values);
		
	}else{//edit
	  $arr_fields=array_keys($data);
	  for($i=0;$i<sizeof($data);$i++){
	  	    $v=Array();
	  		$f=$arr_fields[$i];
			$v[0]=$values[$i];
	  			$sql="update sites set $f=? where id=$id";
				//echo $sql;
				$q=$conn->prepare($sql);
				$q->execute($v);
				
				
	  }  
		
	}
	echo validate();
}
/**
 * Delete a record according to a given Id
 * @param id {integer} record identifier
 **/
function delete($id){
	global $conn;	
	$sql="delete from sites where id=$id";
	$reult=$conn->query($sql);
	echo validate();
}

/**
 * Return a JS code to be inserted in a cliente page
 * @param id {integer} cliente indentifier
 **/
function generate_code($id){
$gen='<script type="text/javascript">function _loadcpo() {
  var s = document.createElement("script");
  s.setAttribute("type", "text/javascript");
  s.setAttribute("src", ("https:" == document.location.protocol ? "https://" : "http://") + "localhost/cpo/server_php/program_footer.php?key=:code");
  document.getElementsByTagName("head")[0].appendChild(s);
  var css = document.createElement("link");
  css.setAttribute("type", "text/css");
  css.setAttribute("rel", "stylesheet");
  css.setAttribute("href", ("https:" == document.location.protocol ? "https://" : "http://") + "localhost/cpo/css/style.css");
  document.getElementsByTagName("head")[0].appendChild(css);
_loadSuper = window.onload;
window.onload = (typeof window.onload != "function") ? _loadcpo : function() { _loadSuper(); _loadcpo(); };
</script>';	
$gen=str_replace(":code",$id,$gen);	
$gen=base64_encode($gen);
$code="{data:'".$gen."'}";



echo $code;
return $code;	
}


/**
 * Return a json with all available sites
 **/
function listAll(){
	
	$sql="select * from sites order by company";
	json($sql);
	
}

function getSite($id){
	$company=base64_decode($id);
	$company=$id;
	$sql="select * from sites where company='$company'";
	json($sql);
	
}

switch ($action){	
	case 'save' :
			save($id,$data);
		break;
	case 'delete':
			delete($id);
		break;
	case 'generate_code':
			generate_code($id);
		break;
	case 'list':
			listAll();
			break;
	case 'getsite':
		getSite($id);	
		break;
}
?>