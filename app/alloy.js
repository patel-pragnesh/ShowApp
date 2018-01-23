// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};
Alloy.Globals.weburl = "http://developer.showappviewer.com/";
Alloy.Globals.databaseName = "showAppdb";
Alloy.Globals.timeOutWebServices = 2000;
Alloy.Globals.currentWindow;
Alloy.Globals.countWindow = 0;
Alloy.Globals.categoryBreadCrum = [];
Alloy.Globals.isOff = false;



// Estas variables globales se setean en el archivo GetLogin y en el archivo Checklogin
Alloy.Globals.id_user_type = 0;
Alloy.Globals.id_company = 0;
Alloy.Globals.unitForAndroid = 0;

Alloy.Globals.osUnits = function (unit){
  //OS_IOS ?  unit=unit :  unit = unit*2;
  OS_IOS ? unit=unit : unit = (parseInt(unit) * (Titanium.Platform.displayCaps.dpi / 160));
  return  unit;
};


Alloy.Globals.colorLuminosity=function(hex, lum) {

	// validate hex string
	hex = String(hex).replace(/[^0-9a-f]/gi, '');
	if (hex.length < 6) {
		hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
	}
	lum = lum || 0;

	// convert to decimal and change luminosity
	var rgb = "#", c, i;
	for (i = 0; i < 3; i++) {
		c = parseInt(hex.substr(i*2,2), 16);
		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
		rgb += ("00"+c).substr(c.length);
	}
	Ti.API.info('COLOR '+rgb);
	return rgb;
};




// added during app creation. this will automatically login to
// ACS for your application and then fire an event (see below)
// when connected or errored. if you do not use ACS in your
// application as a client, you should remove this block

/**
 * Appcelerator Cloud (ACS) Admin User Login Logic
 *
 * fires login.success with the user as argument on success
 * fires login.failed with the result as argument on error
 */
