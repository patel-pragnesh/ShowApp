function GetSubCategoriesAndPresentatioonsByCAtId(idCatetegory){
  var viewForEvents = Ti.UI.createView();

  var url = Alloy.Globals.weburl+"api/v1/getSubsByCatId";
  var connection = Ti.Network.createHTTPClient({timeout:Alloy.Globals.timeOutWebServices});
  connection.setRequestHeader("enctype", "multipart/form-data");
  connection.setRequestHeader("Content-Type:", "text/html; charset=utf-8");
  connection.open("POST",url);
  var dataToSend = {
    id_company:Alloy.Globals.id_company,
    id_user_type:Alloy.Globals.id_user_type,
    id_category:idCatetegory
  }
  connection.send(dataToSend);
  connection.onload = function(){
    var sData = this.responseText;
    var aData = JSON.parse(sData);
    /*Este Evento se llama en el archivo widget.js del widget SubCategories*/
    viewForEvents.fireEvent("loadSubCategories",{aData:aData});
  }
  connection.onerror=function(){
    viewForEvents.fireEvent("loadSubCategoriesError",{});
  }

  return viewForEvents;
}
module.exports = GetSubCategoriesAndPresentatioonsByCAtId;
