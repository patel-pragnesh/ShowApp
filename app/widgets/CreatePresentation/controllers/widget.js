var args = $.args || {};
var DataBaseQuery = require("DataBaseQuery");
var backColor = "#"+Alloy.Globals.conf.background_color;
var colorTitle = "#"+Alloy.Globals.conf.boton_back_color;
var colorForm = "#"+Alloy.Globals.conf.text_form_color;

var canvasHome = Ti.UI.createView({
  width:Ti.UI.FILL,
  height:Ti.UI.FILL,
  backgroundColor:backColor,
  layout:"vertical"
});

$.root.add(canvasHome);

/*Cargamos el Header*/
canvasHome.add(Alloy.createController("HeaderUser",{isModal:true,toClose:$.root}).getView());

/*Titulo de la seccion*/
var canvasTitlePresentation = Ti.UI.createView({
  top:Alloy.Globals.osUnits(20),
  width:Ti.UI.FILL,
  height:Alloy.Globals.osUnits(100),
  backgroundColor:"transparent",
  layout:"vertical"
});
canvasHome.add(canvasTitlePresentation);
var titleSection = Ti.UI.createLabel({
  left:Alloy.Globals.osUnits(20),
  text:L('newPresentation'),
  font:{
    fontFamily:"ProximaNova-Black",
    fontSize:40
  },
  color:colorTitle
});
canvasTitlePresentation.add(titleSection);

var contentForWriteTitle = Ti.UI.createView({
  left:Alloy.Globals.osUnits(20),
  width:Ti.UI.FILL,
  height:Alloy.Globals.osUnits(60),
  layout:"horizontal"
});
canvasTitlePresentation.add(contentForWriteTitle);

var labelForWritetitle = Ti.UI.createLabel({
  width:Ti.UI.SIZE,
  height:Ti.UI.SIZE,
  text:L('writeTitleForNewLabel')+": ",
  font:{
    fontFamily:"ProximaNova-Regular",
    fontSize:15
  },
  color:colorTitle
});
contentForWriteTitle.add(labelForWritetitle);

var textFielForTitle = Ti.UI.createTextField({
  left: Alloy.Globals.osUnits(5),
  width:Alloy.Globals.osUnits(400),
  height:Alloy.Globals.osUnits(30),
  font:{
    fontFamily:"ProximaNova-Regular",
    fontSize:15
  },
  color:colorForm,
  hintText:L('titleHere')
});
contentForWriteTitle.add(textFielForTitle);

/*Agregamos el Canvas para los grupos de presentaciones y view lateral para la visata de los slides*/
var oCanvasForPresentationsAndList = Ti.UI.createView({
  width:Ti.UI.FILL,
  height:Ti.UI.FILL,
  backgroundColor:"transparent",
  layout:"horizontal"
});
canvasHome.add(oCanvasForPresentationsAndList);
/*Ahora las dos secciones la de la izquierda para la lsita de slides seleccionads*/
var contentListSelectedSliders = Ti.UI.createView({
  width:Alloy.Globals.osUnits(300),
  height:Ti.UI.FILL,
  backgroundColor:"red"
});
oCanvasForPresentationsAndList.add(contentListSelectedSliders);
var contentPresentationsForSelected = Ti.UI.createView({
  width:Ti.UI.FILL,
  height:Ti.UI.FILL,
  backgroundColor:"transparent"
});
oCanvasForPresentationsAndList.add(contentPresentationsForSelected);

/*Leemos las Presentaciones Locales*/
var sizeRowForPresentation = Alloy.Globals.osUnits(250);
var aDataPresentations = new DataBaseQuery().getAllPresentations();
var iTotalPresentations = aDataPresentations.length;
var tableForPresentations = Ti.UI.createTableView({
  width:Ti.UI.FILL,
  height:Ti.UI.FILL,
  minRowHeight:sizeRowForPresentation,
  separatorColor:colorForm,
  backgroundColor:"transparent",
  moveable:true,
  moving:true
});
var rowsTableForPresentations = [];
var widgetsForPresentations = [];
for (var i = 0; i < iTotalPresentations; i++) {
  rowsTableForPresentations[i] = Ti.UI.createTableViewRow({
    width:Ti.UI.FILL,
    height:sizeRowForPresentation,
    touchEnabled:false,
    selectedBackgroundColor:"transparent"
  });
  rowsTableForPresentations[i].add(Widget.createWidget("PresentationModelForCreate",{aData:aDataPresentations[i]}).getView());
}
tableForPresentations.data = rowsTableForPresentations;
contentPresentationsForSelected.add(tableForPresentations);
