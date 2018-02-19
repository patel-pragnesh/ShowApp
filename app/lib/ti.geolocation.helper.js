/***
 * @class Lib.TiGeo
 * This library is a helper for geolocation
 *
 * @author Steven House <steven.m.house@gmail.com>
 * @example
 	var geo = require('ti.geolocation.helper');

	 function success(_location) {
			console.warn("location callback success");
			console.info(JSON.stringify(_location));
		}

	 function error(_error) {
			console.error("Location error: " + _error);
		}

	 geo.getLocation({success: success, error: error});
 */

// Exported functions
exports.getLocation = getLocation;
exports.getCompass = getCompass;
exports.getLocationUpdates = getLocationUpdates;
exports.forwardGeocode = forwardGeocode;
exports.reverseGeocode = reverseGeocode;

/**
 * @function handlePermissions
 * @summary Handle permissions for geolocation
 * @param {function} _success The success callback
 * @returns {void}
 */
function handlePermissions(_success) {
	// The first argument is required on iOS and ignored on other platforms
	var hasLocationPermissions = Ti.Geolocation.hasLocationPermissions(Ti.Geolocation.AUTHORIZATION_ALWAYS);
	Ti.API.info('Ti.Geolocation.hasLocationPermissions', hasLocationPermissions);

	if (hasLocationPermissions) {
		//_success();
	}

	Ti.Geolocation.requestLocationPermissions(Ti.Geolocation.AUTHORIZATION_ALWAYS, function(_e) {
		Ti.API.info('Ti.Geolocation.requestLocationPermissions', _e);

		if (_e.success) {

			// Instead, probably call the same method you call if hasLocationPermissions() is true
			//alert('You granted permission.');
			_success();

		} else if (OS_ANDROID) {
			alert('You denied permission for now, forever or the dialog did not show at all because it you denied forever before.');
		} else {

			// We already check AUTHORIZATION_DENIED earlier so we can be sure it was denied now and not before
			Ti.UI.createAlertDialog({
				title: 'You denied permission.',

				// We also end up here if the NSLocationAlwaysUsageDescription is missing from tiapp.xml in which case e.error will say so
				message: _e.error
			}).show();
		}
	});
}

/**
 * @function handlePermissions
 * @summary Start the geolocation
 * @param {Object} _args
 * @param {Function} _args.success Success callback
 * @param {Function} _args.error Error callback
 * @return {Object} Returns something similar to:
	 {
		 "accuracy": 100,
		 "altitude": 0,
		 "altitudeAccuracy": null,
		 "heading": 0,
		 "latitude": 40.493781233333333,
		 "longitude": -80.056671
		 "speed": 0,
		 "timestamp": 1318426498331
	 }
 */
function getLocation(_args) {
	handlePermissions(getLoc);

	function getLoc() {
		if (Ti.Geolocation.locationServicesEnabled) {
			///Titanium.Geolocation.purpose = 'Get Current Location';
			Titanium.Geolocation.getCurrentPosition(function(_e) {
				if (_e.error) {
					console.error('Error: ' + _e.error)
					_args.error && _args.error(_e.error);
				} else {
					_args.success(_e.coords);
				}
			});
		} else {
			alert('Please enable location services');
		}
	}


	/*

	 */
}

/**
 * @function handlePermissions
 * @summary Get the compass
 * @param {Object} _args
 * @param {Function} _args.success Success callback
 * @param {Function} _args.error Error callback
 * @return {Object} The console output of your program will contain the heading information, which will be sent continuously from the heading event. The data for each heading entry will be structured in the following manner.
	 {
		 "accuracy": 3,
		 "magneticHeading": 34.421875,      // degrees east of magnetic north
		 "timestamp": 1318447443692,
		 "trueHeading": 43.595027923583984, // degrees east of true north
		 "type": "heading",
		 "x": 34.421875,
		 "y": -69.296875,
		 "z": -1.140625
	 }
 *
 */
function getCompass(_args) {
	handlePermissions(getComp);

	function getComp() {
		// Use the compass
		if (Ti.Geolocation.locationServicesEnabled) {

			// make a single request for the current heading
			Ti.Geolocation.getCurrentHeading(function(_e) {
				Ti.API.info(_e.heading);
				_args.success && _args.success(_e.heading)
			});

			// Set 'heading' event for continual monitoring
			Ti.Geolocation.addEventListener('heading', function(_e) {
				if (_e.error) {
					console.warn('[ti.getlocation.helper] compass error: ' + _e.error)
					_args.error && _args.error(_e.error);
				} else {
					_args.success && _args.success(_e.heading);
					Ti.API.info(_e.heading);
				}
			});
		} else {
			alert('Please enable location services');
		}
	}
}

/**
 * @function handlePermissions
 * @summary Get Location Updates
 * @param {Object} _args
 * @param {String} _args.purpose
 * @param {Const} _args.accuracy
 * @param {Number} _args.distanceFilter
 * @param {Const} _args.preferredProvider
 * @param {Function} _args.callback
 */
function getLocationUpdates(_args) {
	handlePermissions(getLocUpdates);

	function getLocUpdates() {
		// Configure Location Service Properties
		if (Ti.Geolocation.locationServicesEnabled) {

			Ti.Geolocation.accuracy = _args.accuracy ? _args.accuracy : Ti.Geolocation.ACCURACY_BEST;
			Ti.Geolocation.distanceFilter = _args.distanceFilter ? _args.distanceFilter : 10;
			Ti.Geolocation.preferredProvider = _args.preferredProvider ? _args.preferredProvider : Ti.Geolocation.PROVIDER_GPS;

			Ti.Geolocation.addEventListener('location', function(e) {
				if (e.error) {
					log.error('[Geo] Error: ' + e.error);
					_args.callback && _args.callback(e);
				} else {
					log.error('[Geo] Error: ' + e.error);
					_args.callback && _args.callback(e);
				}
			});
		} else {
			alert('Please enable location services');
		}
	}
}

/**
 * @function handlePermissions
 * @summary Forward Geocode
 * @param {String} _address
 * @param {Object} _args
 * @param {Function} _args.success Success callback
 * @param {Function} _args.error Error callback
 * @returns {Object}
 	{ "accuracy": 1, "latitude": 37.389071, "longitude": -122.050156, "success": 1 }
 */
function forwardGeocode(_address, _args) {
	handlePermissions(fwdGeo);

	function fwdGeo() {
		if (!_address || !_callback) { log.error('[Geo] You must provide address and callback.'); return false; }

		// Forward and Reverse Geocoding
		Ti.Geolocation.forwardGeocoder(_address, _args.success);
	}
}

/**
 * @function handlePermissions
 * @summary Reverse Geocode
 * @param {String} _lat
 * @param {String} _lng
 * @param {Function} _args
 * @return {Object}
 	{
		 "places": [{
			"address": ", 418020 Dzhany-Kuduk, , Kazakhstan", "city": "Oral", "country": "Kazakhstan",
			"country_code": "KZ", "latitude": 50.0, "longitude": 50.0, "street": "", "zipcode": 418020
		 }],
		 "success": 1
	 }
 */
function reverseGeocode(_lat, _lng, _callback) {
	handlePermissions(revGeo);

	function revGeo() {
		if (!_lat || !_lng || !_callback) {
			log.error('[Geo] You must provide address and callback.'); return false;
		}
		Ti.Geolocation.reverseGeocoder(_lat, _lng, _callback);
	}
}
