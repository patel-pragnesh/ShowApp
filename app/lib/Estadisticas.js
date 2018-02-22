function Estadisticas(){}

Estadisticas.prototype.saveEstadisticsDownload = function(oDataToSave){
  var oConnectionServer = Ti.Network.createHTTPClient({timeout:Alloy.Globals.timeOutWebServices});
  oConnectionServer.setRequestHeader("enctype", "multipart/form-data");
  oConnectionServer.setRequestHeader("Content-Type:", "text/html; charset=utf-8");
  var urlToOpen = Alloy.Globals.weburl+"api/v1/saveDowloadStadistics";
  oConnectionServer.open("POST",urlToOpen);
  oConnectionServer.send(oDataToSave);
  return oConnectionServer;
}

Estadisticas.prototype.saveEstadisticsView = function(oDataToSave){
  var oConnectionServer = Ti.Network.createHTTPClient({timeout:Alloy.Globals.timeOutWebServices});
  oConnectionServer.setRequestHeader("enctype", "multipart/form-data");
  oConnectionServer.setRequestHeader("Content-Type:", "text/html; charset=utf-8");
  var urlToOpen = Alloy.Globals.weburl+"api/v1/saveOpenStadistics";
  oConnectionServer.open("POST",urlToOpen);
  oConnectionServer.send(oDataToSave);
  return oConnectionServer;
}
Estadisticas.prototype.saveEstadisticsTimeInPresentation = function(oDataToSave){
  var oConnectionServer = Ti.Network.createHTTPClient({timeout:Alloy.Globals.timeOutWebServices});
  oConnectionServer.setRequestHeader("enctype", "multipart/form-data");
  oConnectionServer.setRequestHeader("Content-Type:", "text/html; charset=utf-8");
  var urlToOpen = Alloy.Globals.weburl+"api/v1/savetimeStadistic";
  oConnectionServer.open("POST",urlToOpen);
  oConnectionServer.send(oDataToSave);
  return oConnectionServer;
}
Estadisticas.prototype.saveViewsFromLocalDataBase = function(oDataToSave){
  var oConnectionServer = Ti.Network.createHTTPClient({timeout:Alloy.Globals.timeOutWebServices});
  oConnectionServer.setRequestHeader("enctype", "multipart/form-data");
  oConnectionServer.setRequestHeader("Content-Type:", "text/html; charset=utf-8");
  var urlToOpen = Alloy.Globals.weburl+"api/v1/saveViewEstadisticMultiple";
  oConnectionServer.open("POST",urlToOpen);
  oConnectionServer.send(oDataToSave);
  return oConnectionServer;
}
Estadisticas.prototype.saveSecondsFromLocalDataBase = function(oDataToSave){
  var oConnectionServer = Ti.Network.createHTTPClient({timeout:Alloy.Globals.timeOutWebServices});
  oConnectionServer.setRequestHeader("enctype", "multipart/form-data");
  oConnectionServer.setRequestHeader("Content-Type:", "text/html; charset=utf-8");
  var urlToOpen = Alloy.Globals.weburl+"api/v1/saveSecondsEstadisticMultiple";
  oConnectionServer.open("POST",urlToOpen);
  oConnectionServer.send(oDataToSave);
  return oConnectionServer;
}
module.exports = Estadisticas;
