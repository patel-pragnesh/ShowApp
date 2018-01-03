/*Lo primero que hacemos es crear la base de datos local*/
var CreateDataBase = require("CreateDataBase");
var Checklogin = require("Checklogin");

if(new CreateDataBase){
	OS_IOS ? $.windowNav.open() : $.root.open();
	OS_IOS ? Alloy.Globals.currentWindow = $.windowNav : Alloy.Globals.currentWindow = $.root;
	Alloy.Globals.openWindow = function(sWidgetToLoad,paramsToWidget){
		Alloy.Globals.countWindow++;
		Alloy.Globals.currentWindow = Alloy.createController("baseWindow",{widget:sWidgetToLoad,paramsToWidget:paramsToWidget}).getView();
		if(OS_IOS){
			$.windowNav.openWindow(Alloy.Globals.currentWindow);
		}else{
			Alloy.Globals.currentWindow.open();
		}

	}

	Alloy.Globals.closeWindow=function(){
		Alloy.Globals.countWindow--;
		if(OS_IOS){
			$.windowNav.closeWindow(Alloy.Globals.currentWindow );
		}else{
			Alloy.Globals.currentWindow.close();
		}
	}


	/*Ahora revisamos si el usaurio esta logeado para saber que View poinemos si el de login o el de Home*/
	var aDataLogin = new Checklogin();
	var isLogin = aDataLogin.length;
	if(isLogin==0){
		/*En este caso no esta logeado el usuario*/
		/*Agregamos el View de Login*/


		$.root.add(Alloy.createController("LoginView",{}).getView());
	}else{
		/*En este caso si esta logeado el usuario*/
		$.root.add(Alloy.createController("HomeView",{widgetToLoad:"Categories",paramsToWidget:{}}).getView());

	}
}

/*Eventos para el Login*/
Ti.App.addEventListener("onLoadLogin",onLogin);
Ti.App.addEventListener('onLoadLoginError',onErrorLogin);
function onLogin(e){

	/*Eliminamos todos los Views en la pantalla de login y mantenemos la ventana de root*/
	$.root.removeAllChildren();
	/*Agregamos el View de Home*/
	$.root.add(Alloy.createController("HomeView",{widgetToLoad:"Categories",paramsToWidget:{}}).getView());
}
function onErrorLogin(e){
	alert("Error al ingresar con este usuario");
}
