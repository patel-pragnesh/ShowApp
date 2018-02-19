<!DOCTYPE html>
<html>
<head>
	<title>Envio de Notificaciones Push</title>
</head>
<body>
<form name="sendPush" id="sendPush" method="POST" action="getMessageAndSend.php">

<div>
<label for="cliente_id">Cliente ID;</label>
<input type="text" name="cliente_id" id="cliente_id"></input>
</div>

<div>
<label for="title">Titulo</label>
<input type="text" name="title" id="title"></input>
</div>

<div>
<label for="message">Mensaje</label>
<input type="text" name="message" id="message"></input>
</div>

<div>
	<select name="ostype" id="ostype">
		<option value="0">Selecciona una opci&oacute;n</option>
		<option value="1">ios</option>
		<option value="2">Android</option>
		<option value="all">Todos</option>
	</select>
</div>

<div>
	<input type="submit">Enviar</input>
</div>

</form>
</body>
</html>
