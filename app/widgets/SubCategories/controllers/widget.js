var CreateDataBase = require("CreateDataBase");
var GetParentCategories = require("GetParentCategories");
var colorBorder = "#"+new CreateDataBase().getProperty("text_form_color");
var colorTitle = "#"+new CreateDataBase().getProperty('boton_back_color');
var backGroundColorConf = "#"+new CreateDataBase().getProperty('boton_back_color');
var textLabelCategoriesColor = Alloy.Globals.colorLuminosity(colorTitle,-0.3);
var args = $.args || {};
$.title.color = colorTitle;

if (Titanium.Network.networkType === Titanium.Network.NETWORK_NONE) {
    /*No hay Conexxion de Nada LOCAL*/
   Titanium.API.info(' no connection ');
} else {
  /*Si hay conexion buscamos las categorias en la base de datos*/
   Titanium.API.info(' connection present ');
  //new GetParentCategories();
}
