/*Lo primero que hacemos es crear la base de datos local*/
var CreateDataBase = require("CreateDataBase");
if(new CreateDataBase){
	OS_IOS ? $.windowNav.open() : $.root.open();
}
