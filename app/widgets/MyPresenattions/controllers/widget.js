var args = $.args || {};
var DataBaseQuery = require("DataBaseQuery");
var backColor = "#"+Alloy.Globals.conf.background_color;
var colorTitle = "#"+Alloy.Globals.conf.boton_back_color;
var colorForm = "#"+Alloy.Globals.conf.text_form_color;
var aDataPresentations;

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
  text:L('MyPresentations'),
  font:{
    fontFamily:"ProximaNova-Black",
    fontSize:40
  },
  color:colorTitle
});
canvasTitlePresentation.add(titleSection);

/*Contenedor de presentaciones*/
var canvasPresentations = Ti.UI.createScrollableView({
    width:Ti.UI.FILL,
  	height:Ti.UI.FILL,
  	backgroundColor:"transparent",
  	showPagingControl:true,
    pagingControlColor:colorTitle
  });
canvasHome.add(canvasPresentations);

/*Leemos todas las presentaciones creadas por el usuario*/
aDataPresentations = new DataBaseQuery().getAllLocalPresentationsCreatedByUser();
var itemsPerPage = 6;
var iTotalPresentations = aDataPresentations.length;
var iTotalPages =  Math.ceil(iTotalPresentations/itemsPerPage);
var pagesPresentations = [];
var fakeIterador = 1;
for (var i = 0; i < iTotalPages; i++) {
  pagesPresentations[i] = Ti.UI.createView({
    width:Ti.UI.FILL,
  	height:Ti.UI.FILL,
    backgroundColor:"transparent",
    layout:"horizontal"
  });
  canvasPresentations.addView(pagesPresentations[i]);

  /*Iniciamos el slice de los datos para cada pagina*/
  var aItemsInpage = [];
  aItemsInpage[i] = aDataPresentations.slice((i*itemsPerPage),itemsPerPage*fakeIterador);
  fakeIterador++

  var iTotalItemsInPage = aItemsInpage[i].length;
  var oItemsViewsPresentations = [];
  var oImagesForPres = [];
  var titleLabel = [];
  var DataForPresentations = []
  var presentationsOnlineFolder = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator +'presentations');
  var aPresentationOnlineFolder = [];
  var aAppOnlienFolder = [];
  var rutaFolders = [];
  var iconImage = [];
  for (var ii = 0; ii < iTotalItemsInPage; ii++) {
    oItemsViewsPresentations[ii] = Ti.UI.createView({
      left:Alloy.Globals.osUnits(10),
      top:Alloy.Globals.osUnits(10),
      width:Alloy.Globals.osUnits(200),
      height:Alloy.Globals.osUnits(250),
      backgroundColor:"transparent",
      layout:"vertical",
      idPressLocal:aItemsInpage[i][ii].idPresentation
    });
    oItemsViewsPresentations[ii].addEventListener("click",function(e){
      var idPresentation = e.source.idPressLocal;
      Widget.createWidget("ShowAppLocalCreated",{idPresentation:idPresentation}).getView().open({modal:true});
    });
    DataForPresentations[ii] = new DataBaseQuery().getLocalPresentationCreateForUserById(aItemsInpage[i][ii].idPresentation);
    //Ti.API.info(JSON.stringify(DataForPresentations[ii]));
    aPresentationOnlineFolder[ii] = Ti.Filesystem.getFile(presentationsOnlineFolder.resolve(), DataForPresentations[ii].Sliders[0].idPresentationOnline);
    aAppOnlienFolder[ii] = Ti.Filesystem.getFile(aPresentationOnlineFolder[ii].resolve(), 'app');
    rutaFolders[ii] = Ti.Filesystem.getFile(aAppOnlienFolder[ii].resolve(), "/sliders/"+DataForPresentations[ii].Sliders[0].folder_slider);
    iconImage[ii] = Ti.Filesystem.getFile(rutaFolders[ii].resolve(), "ico.jpg");

    oImagesForPres[ii] = Ti.UI.createImageView({
      left:0,
      image: iconImage[ii],
      touchEnabled:false
    });
    oItemsViewsPresentations[ii].add(oImagesForPres[ii]);
    titleLabel[ii] = Ti.UI.createLabel({
      left:Alloy.Globals.osUnits(5),
      top:Alloy.Globals.osUnits(10),
      text:aItemsInpage[i][ii].name,
      font:{
        fontFamily:"ProximaNova-Regular",
        fontSize:16
      },
      color:colorTitle,
      touchEnabled:false
    });
    oItemsViewsPresentations[ii].add(titleLabel[ii]);


    pagesPresentations[i].add(oItemsViewsPresentations[ii]);
  }
}
