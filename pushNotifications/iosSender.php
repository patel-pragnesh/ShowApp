<?php
 function sendMessageToIOS($token,$Mensaje,$idPresentation){
	// Put your device token here (without spaces):
  /*Comando para convertir el .cer en .pem*/
  // openssl pkcs12 -in pushcert.p12 -out pushcert.pem -nodes -clcerts
	$deviceToken = "2e8cdd3a230c7f7b3a35890b5a31be9eba03cea9edd14bc058e9f37746b906cd";

	// Put your private key's passphrase here:
	$passphrase = 'Toro123...';//<--- your password

	// Put your alert message here:
	$message = $Mensaje;

	////////////////////////////////////////////////////////////////////////////////

	$ctx = stream_context_create();
	stream_context_set_option($ctx, 'ssl', 'local_cert', 'pushcert.pem');
	stream_context_set_option($ctx, 'ssl', 'passphrase', $passphrase);

	// Open a connection to the APNS server
	$fp = stream_socket_client(
	   'ssl://gateway.sandbox.push.apple.com:2195', $err, // Developer
	    //'ssl://gateway.push.apple.com:2195', $err,//production
	    $errstr, 60, STREAM_CLIENT_CONNECT|STREAM_CLIENT_PERSISTENT, $ctx);

	if (!$fp)
	    exit("Failed to connect: $err $errstr" . PHP_EOL);

	echo 'Connected to APNS' . PHP_EOL;

	// Create the payload body
	$body['aps'] = array(
	    'alert' => array("title"=>'Actualiza Ahora',
                      "body"=>$message,
                     "idPresentationOnline"=>$idPresentation),
	    'sound' => 'default',
      'badge' => 1
	    );

	// Encode the payload as JSON
	$payload = json_encode($body);

	// Build the binary notification
	$msg = chr(0) . pack('n', 32) . pack('H*', $deviceToken) . pack('n', strlen($payload)) . $payload;

	// Send it to the server
	$result = fwrite($fp, $msg, strlen($msg));

	if (!$result)
	    echo 'Message not delivered' . PHP_EOL;
	else
	    echo 'Message successfully delivered' . PHP_EOL;
      echo "<br>";
      echo $$Mensaje;

	// Close the connection to the server
	fclose($fp);
}
sendMessageToIOS("","Existe una actualizacion para la presentacion 'Presentación General' ",11);
?>
