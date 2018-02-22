function PushNotificationsIOS(){
  var deviceToken = null;
  // Wait for user settings to be registered before registering for push notifications
    Ti.App.iOS.addEventListener('usernotificationsettings', function registerForPush() {

        // Remove event listener once registered for push notifications
        Ti.App.iOS.removeEventListener('usernotificationsettings', registerForPush);

        Ti.Network.registerForPushNotifications({
            success: deviceTokenSuccess,
            error: deviceTokenError,
            callback: receivePush
        });
    });

    // Register notification types to use
    Ti.App.iOS.registerUserNotificationSettings({
	    types: [
            Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT,
            Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND,
            Ti.App.iOS.USER_NOTIFICATION_TYPE_BADGE
        ]
    });

    // Process incoming push notifications
    function receivePush(e) {
        //alert('Received push: ' + JSON.stringify(e));
        //Ti.API.info(JSON.stringify(e));
        /*Validamos si esta en background o no*/
        var isRecibedinBackground = e.inBackground;
        if(isRecibedinBackground){
          /*Si se recibio en back*/
          alert(e.data.aps.alert.body);
        }else{
          /*No se recibio en back*/
          alert(e.data.aps.alert.body);
        }
        Ti.UI.iOS.appBadge = 0;
    }
    // Save the device token for subsequent API calls
    function deviceTokenSuccess(e) {
        deviceToken = e.deviceToken;
        Ti.API.info('PUSH TOKEN');
        Ti.API.info(deviceToken);
        /*Registramos el Token en el sistema*/
        var url = Alloy.Globals.weburl+'api/v1/setTokenIDUserForNotifications';
        var oSetTokenInCloud = Ti.Network.createHTTPClient({timeout:Alloy.Globals.timeOutWebServices});
        oSetTokenInCloud.setRequestHeader("enctype", "multipart/form-data");
        oSetTokenInCloud.setRequestHeader("Content-Type:", "text/html; charset=utf-8");
        oSetTokenInCloud.open("POST",url);
        var varsToSend = {
                          idUser: Alloy.Globals.id_user,
                          token:deviceToken,
                          platform:'ios'
                          };

        oSetTokenInCloud.send(varsToSend);
        oSetTokenInCloud.onerror = function(){
          //alert("Error al grabar TOKEN PUSH");
        }
        Ti.UI.iOS.appBadge = 0;
    }

    function deviceTokenError(e) {
        alert('Failed to register for push notifications! ' + e.error);
    }
}
module.exports = PushNotificationsIOS;
