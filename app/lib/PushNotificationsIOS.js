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
        alert('Received push: ' + JSON.stringify(e));
    }
    // Save the device token for subsequent API calls
    function deviceTokenSuccess(e) {
        deviceToken = e.deviceToken;
        Ti.API.info('PUSH TOKEN');
        Ti.API.info(deviceToken);
    }

    function deviceTokenError(e) {
        alert('Failed to register for push notifications! ' + e.error);
    }
}
module.exports = PushNotificationsIOS;
