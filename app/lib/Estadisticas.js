function Estadisticas(){}

Estadisticas.prototype.saveEstadisticsDownload = function(oDataToSave){
  var oConnectionServer = Ti.Network.createHTTPClient({timeout:Alloy.Globals.timeOutWebServices});
  var urlToOpen = Alloy.Globals.weburl+"api/v1/saveDowloadStadistics";
  oConnectionServer.open("POST",urlToOpen);
  oConnectionServer.send(oDataToSave);
  return oConnectionServer;
}

Estadisticas.prototype.saveEstadisticsView = function(oDataToSave){
  var oConnectionServer = Ti.Network.createHTTPClient({timeout:Alloy.Globals.timeOutWebServices});
  var urlToOpen = Alloy.Globals.weburl+"api/v1/saveOpenStadistics";
  oConnectionServer.open("POST",urlToOpen);
  oConnectionServer.send(oDataToSave);
  return oConnectionServer;
}
Estadisticas.prototype.saveEstadisticsTimeInPresentation = function(oDataToSave){
  var oConnectionServer = Ti.Network.createHTTPClient({timeout:Alloy.Globals.timeOutWebServices});
  var urlToOpen = Alloy.Globals.weburl+"api/v1/savetimeStadistic";
  oConnectionServer.open("POST",urlToOpen);
  oConnectionServer.send(oDataToSave);
  return oConnectionServer;
}
module.exports = Estadisticas;
