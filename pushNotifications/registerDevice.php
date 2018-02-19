<?php 
session_start();
/*error_reporting(E_ALL);
ini_set('display_errors', 1);*/
	require("classes/ConexionBD.php");
	include("config.php");
	$conection = new ConexionBD($_SESSION["databaseConnection"]);
	/*Primero Buscamos si no existe el device por direccion MAC*/
	$sqlSearchDevice = sprintf("SELECT token_device_id FROM token_devices WHERE MAC = '%s' LIMIT 1;",
							mysql_real_escape_string($_POST["MAC"]));
	$conection->doQuery($sqlSearchDevice);
	$conection->setWhile();
	$existDevice = $conection->getNumrows();
	if($existDevice>0){
		echo "Update";
		/*Solo hacemos update al device para el token*/
		$sqlToRegisterDevice = sprintf("UPDATE token_devices SET token_char = '%s' WHERE token_device_id = '%s';",
										mysql_real_escape_string($_POST["token_char"]),
										 $conection->getDataSQL("token_device_id"));
	}else{
		echo "Insert";
		$sqlToRegisterDevice = sprintf("INSERT INTO token_devices (client_id, token_char, os, ostype ,MAC,fecha_alta) VALUES('%s','%s','%s','%s','%s','%s');",
							mysql_real_escape_string($_POST["client_id"]),
							mysql_real_escape_string($_POST["token_char"]),
							mysql_real_escape_string($_POST["os"]),
							mysql_real_escape_string($_POST["ostype"]),
							mysql_real_escape_string($_POST["MAC"]),
							date("Y-m-d"));
	
	}
	$conection->doQuery($sqlToRegisterDevice);
	$conection->setFreeResult();
	$conection->setClose();
	echo "OK";
?>