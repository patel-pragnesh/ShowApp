var args = $.args || {};
var DataBaseQuery = require("DataBaseQuery");
var backColor = "#"+Alloy.Globals.conf.background_color;
var colorTitle = "#"+Alloy.Globals.conf.boton_back_color;
var colorForm = "#"+Alloy.Globals.conf.text_form_color;

Alloy.Globals.titleForNewPresentation = "";

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
  layout:"horizontal"
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
  left:Alloy.Globals.osUnits(60),
  width:Alloy.Globals.osUnits(400),
  height:Alloy.Globals.osUnits(60),
  backgroundColor:colorTitle,

});
canvasTitlePresentation.add(contentForWriteTitle);

/*Icono para los documentos*/
var iconDocumentsContent = Ti.UI.createView({
  left:Alloy.Globals.osUnits(30),
  width:Alloy.Globals.osUnits(60),
  height:Alloy.Globals.osUnits(60),
  backgroundColor:"transparent"
});
iconDocumentsContent.addEventListener("click",onClickDocumentsIcon);
canvasTitlePresentation.add(iconDocumentsContent);
var iconDocuments = Ti.UI.createImageView({
  image:"/images/icon_documents.png",
  touchEnabled:false
});
iconDocumentsContent.add(iconDocuments);
var badgeForDocuments = Ti.UI.createView({
  top:0,
  right:0,
  width:Alloy.Globals.osUnits(20),
  height:Alloy.Globals.osUnits(20),
  borderRadius:Alloy.Globals.osUnits(10),
  backgroundColor:"red",
  touchEnabled:false,
  visible:false
});
iconDocumentsContent.add(badgeForDocuments);
var labelForBadge = Ti.UI.createLabel({
  color:"#FFF",
  font:{
    fontFamily:"ProximaNova-Regular",
    fontSize:13
  }
});
badgeForDocuments.add(labelForBadge);

var textFielForTitle = Ti.UI.createTextField({
  left: Alloy.Globals.osUnits(10),

  width:"90%",
  height:Alloy.Globals.osUnits(30),
  font:{
    fontFamily:"ProximaNova-Regular",
    fontSize:20
  },
  color:"#FFF",
  value:L('titleHere')
  //hintText:L('titleHere'),
});
textFielForTitle.addEventListener("change",function(e){
  Alloy.Globals.titleForNewPresentation = e.value;
});
contentForWriteTitle.add(textFielForTitle);

/*Agregamos el Canvas para los grupos de presentaciones y view lateral para la visata de los slides*/
var oCanvasForPresentationsAndList = Ti.UI.createView({
  width:Ti.UI.FILL,
  height:Ti.UI.FILL,
  backgroundColor:"#FFF",
  layout:"horizontal"
});
canvasHome.add(oCanvasForPresentationsAndList);
/*Ahora las dos secciones la de la izquierda para la lsita de slides seleccionads*/
var contentListSelectedSliders = Ti.UI.createView({
  width:Alloy.Globals.osUnits(350),
  height:Ti.UI.FILL,
  backgroundColor:"transparent"
});

/*Agregamos la tabla de los nuevos sliders*/
var oTableNewSliders = Widget.createController("TableWidthNewSliders",{}).getView();
oTableNewSliders.addEventListener("onCreateNewPresentation",onCreateNewPress);
contentListSelectedSliders.add(oTableNewSliders);
oCanvasForPresentationsAndList.add(contentListSelectedSliders);
var contentPresentationsForSelected = Ti.UI.createView({
  width:Ti.UI.FILL,
  height:Ti.UI.FILL,
  backgroundColor:"transparent"
});
oCanvasForPresentationsAndList.add(contentPresentationsForSelected);

/*Leemos las Presentaciones Locales*/
var sizeRowForPresentation = Alloy.Globals.osUnits(285);
var aDataPresentations = new DataBaseQuery().getAllPresentations();
var iTotalPresentations = aDataPresentations.length;
var tableForPresentations = Ti.UI.createTableView({
  width:Ti.UI.FILL,
  height:Alloy.Globals.osUnits(500),
  minRowHeight:sizeRowForPresentation,
  separatorColor:colorForm,
  backgroundColor:"transparent",
  moveable:false,
  moving:false
});
var rowsTableForPresentations = [];
var widgetsForPresentations = [];
var widgetModelPresentation = [];
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



/*evento para agregar un nuevo documento a la nueva presentacion*/
var oContentTable = Ti.UI.createView({
  width:Alloy.Globals.osUnits(500),
  height:Alloy.Globals.osUnits(600),
  layout:"vertical"
});
var titleTable = Ti.UI.createLabel({
  top:Alloy.Globals.osUnits(15),
  text:"Documentos Agregados",
  font:{
    fontFamily:"ProximaNova-Bold",
    fontSize:20
  },
  color:colorTitle
});
oContentTable.add(titleTable);
var oTableForDocuments = Ti.UI.createTableView({
  top:Alloy.Globals.osUnits(15),
  width:Ti.UI.FILL,
  height:Ti.UI.FILL,
  backgroundColor:"#FFF",
  minRowHeight:Alloy.Globals.osUnits(50),
  editable:true,
});
oContentTable.add(oTableForDocuments);
var pop = Ti.UI.iPad.createPopover({
  backgroundColor:"#FFF",
  contentView:oContentTable
});
Ti.App.addEventListener("addDocumentToNewPresentation",onNewDocumentIsAdded);
function onNewDocumentIsAdded(e){
  Ti.API.info(e.aData);

  /*Creamos el RowPara este documento*/
  var oRowForDocument = Ti.UI.createTableViewRow({
    width:Ti.UI.FILL,
    height:Alloy.Globals.osUnits(50),
    editable:true,
    title:e.aData.docData.name,
    font:{
      fontFamily:"ProximaNova-Regular",
      fontSize:20
    },
    color:colorForm,
    aDataDocument:e.aData
  });
  oTableForDocuments.appendRow(oRowForDocument);
  //Alloy.Globals.aDataDocumentsForNewPresentation.push(e.aData);
  // var iTotalDocuemnts = Alloy.Globals.aDataDocumentsForNewPresentation.length;
  var iTotalDocuemnts = oTableForDocuments.data[0].rows.length;
  labelForBadge.text = iTotalDocuemnts;
  badgeForDocuments.visible = true;
}

/*evento para ver los documentos agregados*/

function onClickDocumentsIcon(e){
  if(OS_IOS){
    pop.show({view:iconDocumentsContent});
  }
}

/*Evento on create new Aqui grabamos los documentos de la presentacion*/
function onCreateNewPress(e){
  var idNewPress = e.idNewPresentation;
  var haveDocuments = oTableForDocuments.data.length;

  if(haveDocuments>0){
    /*Guardamos los documentos en la nueva presentacion*/
    var aDocumentsData = oTableForDocuments.data[0].rows;

    var iTotalDocumentsForSave = aDocumentsData.length;
    var aDataToSave = [];
    for (var i = 0; i < iTotalDocumentsForSave; i++) {
      aDataToSave.push({id_created_presentation:idNewPress,
                        id_presentation_online:aDocumentsData[i].aDataDocument.pressData.idOnLine,
                        name:aDocumentsData[i].aDataDocument.docData.name,
                        mime_type:aDocumentsData[i].aDataDocument.docData.mime,
                        file:aDocumentsData[i].aDataDocument.docData.file,
                        });

    }
    Ti.API.info(aDataToSave);
    e = null;
    if(new DataBaseQuery().setDocumentsForNewPresentation(aDataToSave)){
      $.root.close();
      Widget.createWidget("ShowAppLocalCreated",{idPresentation:idNewPress}).getView().open({modal:true});
    }
  }else{
      e = null;
      $.root.close();
      Widget.createWidget("ShowAppLocalCreated",{idPresentation:idNewPress}).getView().open({modal:true});
  }
}
