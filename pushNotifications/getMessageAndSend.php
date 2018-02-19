<?php 
//session_start();
/*error_reporting(E_ALL);
ini_set('display_errors', 1);*/
	require("classes/ConexionBD.php");
	include("config.php");
	include("iosSender.php");
	include("androidSender.php");

$connection = new ConexionBD($_SESSION["databaseConnection"]);
$osToSend = $_POST["ostype"];

/*Primero Guardamos el Mensaje en la tabla push_messajes_to_send*/
$sqlToSaveMesage = sprintf("INSERT INTO push_messajes_to_send (client_id, title,message, date_send) VALUES ('%s','%s','%s','%s');",
							mysql_real_escape_string($_POST["cliente_id"]),
							mysql_real_escape_string($_POST["title"]),
							mysql_real_escape_string($_POST["message"]),
							date("Y-m-d"));
$connection->doQuery($sqlToSaveMesage);
$inserIdMessage = $connection->getInsertID();


switch ($osToSend) {
	case '1':
		$sqlToSelectDevices = sprintf("SELECT token_device_id, token_char, ostype FROM token_devices WHERE client_id = '%s' AND ostype = '%s';",
								mysql_real_escape_string($_POST["cliente_id"]),
								mysql_real_escape_string($osToSend));
	break;
	case '2':
		$sqlToSelectDevices = sprintf("SELECT token_device_id, token_char, ostype FROM token_devices WHERE client_id = '%s' AND ostype = '%s';",
								mysql_real_escape_string($_POST["cliente_id"]),
								mysql_real_escape_string($osToSend));
	break;
	case 'all':
		$sqlToSelectDevices = sprintf("SELECT token_device_id, token_char, ostype FROM token_devices WHERE client_id = '%s';",
								mysql_real_escape_string($_POST["cliente_id"]));
	break;
	
	default:
		# code...
		break;
}
//echo $sqlToSelectDevices;
$connection->doQuery($sqlToSelectDevices);
$androidTokenIDS = array();
$iosTokens = array();
echo $connection->getNumRows();
while($connection->setWhile()){
	/*Envio para IOS*/
	//echo $connection->getDataSQL("ostype")."<br>";  
	if($connection->getDataSQL("ostype")==1){
		sendMessageToIOS($connection->getDataSQL("token_char"),$_POST["message"]);
		array_push($iosTokens,$connection->getDataSQL("token_char"));
	}
	if($connection->getDataSQL("ostype")==2){
		array_push($androidTokenIDS,$connection->getDataSQL("token_char"));
	}
	echo $connection->getDataSQL("ostype");
	/*Grasbamos en la tabla SENT*/
	$sqlToSent = sprintf("INSERT INTO push_messages_sent (token_device_id, push_messaje_id) VALUES ('%s','%s');",
				mysql_real_escape_string($connection->getDataSQL("token_device_id")),
				$inserIdMessage);
	//$connection->doQuery($sqlToSent);
}
$totalSendsAndroid = count($androidTokenIDS);
if($osToSend!="1" && $totalSendsAndroid>0){
	sendAndroidMessage($androidTokenIDS,$_POST["message"]);
	echo "<br>Envio Android ok<br>" ;
}
?>