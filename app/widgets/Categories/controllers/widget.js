var DataBaseQuery = require("DataBaseQuery");
var GetParentCategories = require("GetParentCategories");
var colorBorder = "#"+Alloy.Globals.conf.text_form_color;
var colorTitle = "#"+Alloy.Globals.conf.boton_back_color;
var backGroundColorConf = "#"+Alloy.Globals.conf.boton_back_color;
var textLabelCategoriesColor = Alloy.Globals.colorLuminosity(colorTitle,-0.3);
var oViewConnection;
$.title.color = colorTitle;

if (Titanium.Network.networkType === Titanium.Network.NETWORK_NONE) {
    /*No hay Conexxion de Nada LOCAL*/
   Titanium.API.info(' no connection ');
} else {
  /*Si hay conexion buscamos las categorias en la base de datos*/
   Titanium.API.info(' connection present ');
  oViewConnection = new GetParentCategories();
  /*Llamado al Evento de carga de la data de categorias*/
  oViewConnection.addEventListener('onLoadDataParentCategories',onLoadCategories);
  oViewConnection.addEventListener('onLoadDataParentCategoriesError',checkIfLocalCategories);
}

/*Creamos el Loader*/
var oLoader = Ti.UI.createActivityIndicator({
  style:Titanium.UI.ActivityIndicatorStyle.BIG
});
$.canvasCategories.add(oLoader);
oLoader.show();




function onLoadCategories(e){
  Ti.API.info('Datos de categorias');
  Ti.API.info(e.aData);
  var aData = e.aData;
  var iTotalRows = aData.length;
  var aRows = [];
  var aViewForRows = [];
  var aLabelForRows = [];
  var sectionsSeparators = [];
  var aArrowLeft = [];
  var aBotonSensible = [];

  oLoader.hide();



  /*Creamos la Tabla para las categorias*/
  var oTable = Ti.UI.createScrollView({
    width:Ti.UI.FILL,
    height:Ti.UI.FILL,
    backgroundColor:"transparent",
    layout:"vertical"
  });
  $.canvasCategories.add(oTable);
  for (var i = 0; i < iTotalRows; i++) {
    // Ti.API.info('Color: ');
    // Ti.API.info(textLabelCategoriesColor);
    aRows[i] = Ti.UI.createView({
      height:Alloy.Globals.osUnits(60),
      backgroundColor:"transparent",
      top:Alloy.Globals.osUnits(5)
    });
    aViewForRows[i] = Ti.UI.createView({
      width:Ti.UI.FILL,
      height:Ti.UI.FILL,
      borderColor:colorBorder,
      borderWidth:0.5,
      backgroundColor:"#FFF",
      idCategory:aData[i].id_category,
      aDataCategory:aData[i].get_category
    });
    //aViewForRows[i].fireEvent('click',{idCategory:aData[i].id_category});
    aViewForRows[i].addEventListener('click',function (e){
      //Ti.API.info(JSON.stringify(e));
      //Ti.API.info(e.source.idCategory);
      var idCategory = e.source.idCategory;
      var aDataCategory = e.source.aDataCategory
      onClickBtnCategory(aDataCategory);
      Alloy.Globals.categoryBreadCrum.push(aDataCategory);
    });

    aLabelForRows[i] = Ti.UI.createLabel({
      width:Ti.UI.SIZE,
      height:Ti.UI.FILL,
      left: Alloy.Globals.osUnits(20),
      text:aData[i].get_category.name,
      color:textLabelCategoriesColor,
      font:{
        fontFamily:"AvenirNextLTPro-Bold",
        fontSize:Alloy.Globals.osUnits(20)
      }
    });
    aViewForRows[i].add(aLabelForRows[i]);

    aArrowLeft[i] = Ti.UI.createImageView({
      right:Alloy.Globals.osUnits(20),
      width:Ti.UI.SIZE,
      height:Ti.UI.SIZE,
      image:"/images/arrow_right.png"
    });
    aViewForRows[i].add(aArrowLeft[i]);





    aRows[i].add(aViewForRows[i]);
    oTable.add(aRows[i]);
  }
  oViewConnection.removeEventListener('onLoadDataParentCategories',onLoadCategories);
  oViewConnection = null;
}
function onClickBtnCategory(aDataCategory){
  //Ti.API.info('IdCategory: '+idCategory);
  Alloy.Globals.openNewWindow("SubCategories",{aDataCategory:aDataCategory});
}

/*------------------------ LOCAL -----------------------------------*/
function checkIfLocalCategories(){
  /*Leemos las categorias locales*/
  var datos = new DataBaseQuery().getParentCategoriesOffline();
  var iTotalCatsOffline = datos.length;
  if(iTotalCatsOffline>0){
    /*CArgamos el Contenido*/
    oLoader.hide();
    oViewConnection.fireEvent('onLoadDataParentCategories',{aData:datos});

  }else{
    alert(L('noDataNoInternet'));
  }
}
