function GetParentCategories(){
  var viewForEvent = Ti.UI.createView();
  var url = Alloy.Globals.weburl+'api/v1/getParentCategories';
  var connection = Ti.Network.createHTTPClient({timeout:Alloy.Globals.timeOutWebServices});
  connection.setRequestHeader("enctype", "multipart/form-data");
  connection.setRequestHeader("Content-Type:", "text/html; charset=utf-8");
  connection.open("POST",url);
  var varsToSend = {
    id_company: Alloy.Globals.id_company ,
    id_user_type: Alloy.Globals.id_user_type
  }
  // Ti.API.info('DatoToParentCategories');
  // Ti.API.info(varsToSend);
  connection.send(varsToSend);

  connection.onload = function(){
    var sData = this.responseText;
    var aData = JSON.parse(sData);
    Ti.API.info('Data de Categorias Padre');
    Ti.API.info(sData);
    if(aData.length>0){
      /*Este evento se llama en el Widget de Categories en el archivo widget.js*/
      viewForEvent.fireEvent("onLoadDataParentCategories",{aData:aData});
    }else{
      viewForEvent.fireEvent("onLoadDataParentCategoriesError",{aData:false});
    }
  }
  connection.onerror = function(){
    viewForEvent.fireEvent("onLoadDataParentCategoriesError",{aData:false});
  }
  return viewForEvent;
}
module.exports = GetParentCategories;
