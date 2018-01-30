/*Lo primero que hacemos es crear la base de datos local*/
var CreateDataBase = require("CreateDataBase");
var DataBaseQuery = require("DataBaseQuery")
var Checklogin = require("Checklogin");
var windowOpensInAndroid = [];
if(OS_IOS){
	var PushNotificationsIOS = require("PushNotificationsIOS");
	new PushNotificationsIOS();
}

/*Se crea el directorio para presentaciones unicas de este usuario*/
var localUserPresentationsFolder = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator +'my_presentations');
if(!localUserPresentationsFolder.exists()){
	localUserPresentationsFolder.createDirectory();
}

if(new CreateDataBase){
	OS_IOS ? $.windowNav.open() : $.root.open();
	OS_IOS ? Alloy.Globals.currentWindow = $.windowNav : Alloy.Globals.currentWindow = $.root;

	Alloy.Globals.openNewWindow = function(sWidgetToLoad,paramsToWidget){
		Alloy.Globals.countWindow++;
		// var sWidgetToLoad = sWidgetToLoad;
		// var paramsToWidget = paramsToWidget;
		if(OS_IOS){
			var newWindow = Alloy.createController("baseWindow",{widget:sWidgetToLoad,paramsToWidget:paramsToWidget}).getView();
			$.windowNav.openWindow(newWindow);
		}else{
			var newWindow =  Alloy.createController("baseWindow",{widget:sWidgetToLoad,paramsToWidget:paramsToWidget}).getView();
			newWindow.open();
			windowOpensInAndroid.push(newWindow);

		}
		newWindow = null;
	}

	Alloy.Globals.closeWindow=function(ToClose){
		Alloy.Globals.countWindow--;


		if(OS_IOS){
			$.windowNav.closeWindow(ToClose);
			//$.windowNav.popToRootWindow();
		}else{
			windowOpensInAndroid.pop();
			ToClose.close();
		}
		ToClose = null;
	}


	/*Ahora revisamos si el usaurio esta logeado para saber que View poinemos si el de login o el de Home*/
	var aDataLogin = new Checklogin();
	var isLogin = aDataLogin.length;
	if(isLogin==0){
		/*En este caso no esta logeado el usuario*/
		/*Agregamos el View de Login*/


		$.root.add(Alloy.createController("LoginView",{}).getView());
	}else{
		/*Traemos todas las variables de configuracion*/
		Alloy.Globals.conf = new DataBaseQuery().getAllProperties();
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
	//Ti.API.info('Llego aqui');
	Alloy.Globals.conf = new DataBaseQuery().getAllProperties();
	$.root.add(Alloy.createController("HomeView",{widgetToLoad:"Categories",paramsToWidget:{}}).getView());
}
function onErrorLogin(e){
	alert("Error al ingresar con este usuario");
}


/*Evento para cerrar la sesion*/
Ti.App.addEventListener("closeSession",onCloseSession);
function onCloseSession(e){
	if(OS_IOS){
		$.windowNav.popToRootWindow();
		$.root.removeAllChildren();
		$.root.add(Alloy.createController("LoginView",{}).getView());
	}else{
		while(windowOpensInAndroid.length>0){
			windowOpensInAndroid.pop().close();
		}
		$.root.removeAllChildren();
		$.root.add(Alloy.createController("LoginView",{}).getView());
	}
}
