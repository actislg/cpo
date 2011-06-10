<?php
include_once('../server_php/config.inc.php');
session_start();

$conn = new PDO("mysql:host=$DBHostName;dbname=$DBName",$DBUserName,$DBPassword);

$key=$_REQUEST['key'];


	$sql="select * from cpo_prg.sites where company='$key'";
	$result=$conn->query($sql);
	$trows = $result->rowCount();
	$arr=array();
	$rec = $result->fetch(PDO::FETCH_ASSOC);







?>