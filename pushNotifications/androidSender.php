<?php
function sendAndroidMessage($arrayDevices,$Mensaje,$titulo){
	// API access key from Google API's Console
	define( 'API_ACCESS_KEY', 'AIzaSyCuigRDozw1v5qoieJ7ouaqClvhNpGyhFU' );
	$registrationIds = $arrayDevices;
	//$registrationIds = array( $_GET['id'] );
	// prep the bundle
	$msg = array
	(
		'message' 	=> $Mensaje,
		'title'		=> $titulo,
		'subtitle'	=> '',
		'tickerText'	=> 'Ticker text here...Ticker text here...Ticker text here',
		'vibrate'	=> 1,
		'sound'		=> 1,
		'largeIcon'	=> 'large_icon',
		'smallIcon'	=> 'small_icon'
	);
	$fields = array
	(
		'registration_ids' 	=> $registrationIds,
		'data'			=> $msg
	);
	 
	$headers = array
	(
		'Authorization: key=' . API_ACCESS_KEY,
		'Content-Type: application/json'
	);
	 
	$ch = curl_init();
	curl_setopt( $ch,CURLOPT_URL, 'https://android.googleapis.com/gcm/send' );
	curl_setopt( $ch,CURLOPT_POST, true );
	curl_setopt( $ch,CURLOPT_HTTPHEADER, $headers );
	curl_setopt( $ch,CURLOPT_RETURNTRANSFER, true );
	curl_setopt( $ch,CURLOPT_SSL_VERIFYPEER, false );
	curl_setopt( $ch,CURLOPT_POSTFIELDS, json_encode( $fields ) );
	$result = curl_exec($ch );
	curl_close( $ch );
	echo $result;
}
?>