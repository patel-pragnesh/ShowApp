/*Lo primero que hacemos es crear la base de datos local*/
var CreateDataBase = require("CreateDataBase");
var Checklogin = require("Checklogin");

if(new CreateDataBase){
	OS_IOS ? $.windowNav.open() : $.root.open();
}

/*Ahora revisamos si el usaurio esta logeado para saber que View poinemos si el de login o el de Home*/
var aDataLogin = new Checklogin();
var isLogin = aDataLogin.length;
if(isLogin==0){
	/*En este caso no esta logeado el usuario*/
	/*Agregamos el View de Login*/
	$.root.add(Alloy.createController("LoginView",{}).getView());
}else{
	/*En este caso si esta logeado el usauros*/
}
