var args = $.args || {};

var DataBaseQuery = require("DataBaseQuery");
var GetSubCategoriesAndPresentatioonsByCAtId = require("GetSubCategoriesAndPresentatioonsByCAtId");
var PresentationItemInCategory = require("PresentationItemInCategory");
var colorBorder = "#"+Alloy.Globals.conf.text_form_color;
var colorTitle = "#"+Alloy.Globals.conf.boton_back_color;
var backGroundColorConf = "#"+Alloy.Globals.conf.boton_back_color;
var textLabelCategoriesColor = Alloy.Globals.colorLuminosity(colorTitle,-0.3);

var iItemsPerPage = 6;
var heightCanvasCategories = Alloy.Globals.osUnits(280);
var canvasCategories = Ti.UI.createScrollView();
var oConnectionData;
$.title.color = colorTitle;

if (Titanium.Network.networkType === Titanium.Network.NETWORK_NONE) {
    /*No hay Conexxion de Nada LOCAL*/
   Titanium.API.info(' no connection ');
} else {
  /*Si hay conexion buscamos las categorias en la base de datos*/
   Titanium.API.info(' connection present ');
  oConnectionData = new GetSubCategoriesAndPresentatioonsByCAtId(args.aDataCategory.id_category);
  oConnectionData.addEventListener("loadSubCategories",onLoadSubCategoriesAndPresentations);
  oConnectionData.addEventListener("loadSubCategoriesError",onErrorLoadSubCategories);
}

/*Creamos el Loader*/
var oLoader = Ti.UI.createActivityIndicator({
  style:Titanium.UI.ActivityIndicatorStyle.BIG
});
$.rootCategories.add(oLoader);
oLoader.show();

function onLoadSubCategoriesAndPresentations(e){
  var aData = e.aData;
  Ti.API.info("SubCategoryData");
   Ti.API.info(aData);
  var aDataPresntations = aData.get_category.presentations;

  var iTotalSubCategories = aData.get_category.sub_categories.length;
  var iTotalPresentations = aDataPresntations.length;

  /*Construccion de Subcategorias*/
  if(iTotalSubCategories>0){
    if(iTotalPresentations==0){
      heightCanvasCategories = Ti.UI.FILL;
    }
    buildSubCategories(aData.get_category.sub_categories);
  }else{
    iItemsPerPage = 12;
  }
  /*Construccion de presentaciones*/
  Ti.API.info('Presentaciones Aqui: '+iTotalPresentations);
  if(iTotalPresentations>0){
    buildPresentations(aDataPresntations);
  }

  $.title.text = aData.get_category.name;

  /*Se remueve el loeader*/
  oLoader.hide();
  $.rootCategories.remove(oLoader);

}
function buildSubCategories(aDataSubs){
  Ti.API.info('ALTO Categorias '+ heightCanvasCategories);
  var style = $.createStyle({
        classes: "canvasCategories",
        apiName: 'View',

    });


  canvasCategories.applyProperties(style);
  $.rootCategories.add(canvasCategories);
  canvasCategories.height = heightCanvasCategories;
  var iTotalItems = aDataSubs.length;
  var itemsForSubCategories = [];
  var aViewForRows =[];
  var aLabelForRows = [];
  var aArrowLeft =[];
  for (var i = 0; i < iTotalItems; i++) {
     itemsForSubCategories[i] = Ti.UI.createView({
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
       idCategory:aDataSubs[i].id_category,
       aDataCategory:aDataSubs[i]
     });
     aViewForRows[i].addEventListener("click",function(e){
        onClickBtnCategory(e.source.aDataCategory);
     });
     itemsForSubCategories[i].add(aViewForRows[i])
     aLabelForRows[i] = Ti.UI.createLabel({
       width:Ti.UI.SIZE,
       height:Ti.UI.FILL,
       left: Alloy.Globals.osUnits(20),
       text:aDataSubs[i].name,
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


     canvasCategories.add(itemsForSubCategories[i]);
  }
  /*END buildSubCategories*/
  oConnectionData.removeEventListener("loadSubCategories",onLoadSubCategoriesAndPresentations);
  //oConnectionData = null;


}

function buildPresentations(aData){
  var style = $.createStyle({
        classes: "canvasPresentations",
        apiName: 'View',
        pagingControlColor:colorTitle
    });
  var canvasPresentations = Ti.UI.createScrollableView();
  canvasPresentations.applyProperties(style);
  var iTotalData = aData.length;

  var iTotalPages = Math.ceil(iTotalData/iItemsPerPage);

  Ti.API.info('Press: '+iTotalData);
  Ti.API.info('Pages: '+iTotalPages);
  var oPagesViews = [];
  var fakeIterador = 1;
  for (var i = 0; i < iTotalPages; i++) {
    oPagesViews[i] = Ti.UI.createView({
      width:Ti.UI.FILL,
      height:Ti.UI.FILL,
      backgroundColor:"transparent",
      layout:"horizontal"
    });
    canvasPresentations.addView(oPagesViews[i]);
    /*Iniciamos el slice de los datos para cada pagina*/
    var aItemsInpage = [];
    aItemsInpage[i] = aData.slice((i*iItemsPerPage),iItemsPerPage*fakeIterador);
    fakeIterador++

    var iTotalItemsInPage = aItemsInpage[i].length;
    var oItemsViewsPresentations = [];
    for (var ii = 0; ii < iTotalItemsInPage; ii++) {
      oItemsViewsPresentations[ii] = new PresentationItemInCategory(aItemsInpage[i][ii]).getItemForCategory();
      oPagesViews[i].add(oItemsViewsPresentations[ii]);
    }
  }


  $.rootCategories.add(canvasPresentations);

  oConnectionData.removeEventListener("loadSubCategories",onLoadSubCategoriesAndPresentations);
  oConnectionData = null;
}

function onClickBtnCategory(aDataCategory){
    Alloy.Globals.openNewWindow("SubCategories",{aDataCategory:aDataCategory});
    Alloy.Globals.categoryBreadCrum.push(aDataCategory);
}


/*--------------OFFLINE --------------------------------------*/
function onErrorLoadSubCategories(){
    oLoader.hide();
  var datosSubs = new DataBaseQuery().getSubCategoriesAndPresentationsByParentID(args.aDataCategory.id_category);
  /*Construimos el contenido*/
  oConnectionData.fireEvent('loadSubCategories',{aData:datosSubs});

  // Ti.API.info('Sub Cats Local');
  // Ti.API.info(JSON.stringify(datosSubs));
}
