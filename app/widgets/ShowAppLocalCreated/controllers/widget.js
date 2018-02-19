var args = $.args || {};
var DataBaseQuery = require("DataBaseQuery");
var idPresentationLocal = args.idPresentation;
var documentsData = [];
var isOpenControls = false;
var animationOpen = Ti.UI.createAnimation();
animationOpen.top = 0;
animationOpen.duration = 500;
var animationClose =  Ti.UI.createAnimation();
animationClose.top = Alloy.Globals.osUnits(-50);
animationClose.duration = 500;
var imageMenu = '/images/icon_dwon.png';

var animationOpenIndice = Ti.UI.createAnimation();
animationOpenIndice.left = 0;
animationOpenIndice.duration = 500;

var animationCloseIndice = Ti.UI.createAnimation();
animationCloseIndice.left = Alloy.Globals.osUnits(-300);
animationCloseIndice.duration = 500;

var indiceIsOpen = false;
// var oWebView = Ti.UI.createWebView({
//   width:Ti.UI.FILL,
//   height:Ti.UI.FILL,
// });

var oContentSliders = Ti.UI.createScrollableView({
  width:Ti.UI.FILL,
  height:Ti.UI.FILL,
  scrollingEnabled:Alloy.Globals.isSliderPresentation
});

/*Menu contenedor*/
var oMenuContent = Ti.UI.createView({
  top:0,
  width:Ti.UI.SIZE,
  height:Alloy.Globals.osUnits(50),
  backgroundColor:"transparent",
  layout:"horizontal"
});
$.headerControls.add(oMenuContent);
var oBtnsForMenu = [];
var leftSeparator = 18;
oBtnsForMenu[0] = {
                    view:Ti.UI.createView({
                      top:Alloy.Globals.osUnits(15),
                      width:Ti.UI.SIZE,
                      height:Ti.UI.SIZE,
                    }),
                    icon:Ti.UI.createImageView({
                      width:Alloy.Globals.osUnits(30),
                      height:Alloy.Globals.osUnits(30),
                      image:"/images/icon_home.png"
                    }),
                    listener:gotoHomePresentation
                  };
oBtnsForMenu[1] = {
                    view:Ti.UI.createView({
                      top:Alloy.Globals.osUnits(15),
                      width:Ti.UI.SIZE,
                      height:Ti.UI.SIZE,
                      left:Alloy.Globals.osUnits(leftSeparator),
                    }),
                    icon:Ti.UI.createImageView({
                      width:Alloy.Globals.osUnits(30),
                      height:Alloy.Globals.osUnits(30),
                      image:"/images/icon_indice.png"
                    }),
                    listener:openIndice
                  };
oBtnsForMenu[2] = {
                    view:Ti.UI.createView({
                      top:Alloy.Globals.osUnits(15),
                      width:Ti.UI.SIZE,
                      height:Ti.UI.SIZE,
                      left:Alloy.Globals.osUnits(leftSeparator),
                    }),
                    icon:Ti.UI.createImageView({
                      width:Alloy.Globals.osUnits(30),
                      height:Alloy.Globals.osUnits(30),
                      image:"/images/icon_right.png"
                    }),
                    listener:sliderRightPresentation
                  };
oBtnsForMenu[3] = {
                    view:Ti.UI.createView({
                      top:Alloy.Globals.osUnits(15),
                      width:Ti.UI.SIZE,
                      height:Ti.UI.SIZE,
                      left:Alloy.Globals.osUnits(leftSeparator),
                    }),
                    icon:Ti.UI.createImageView({

                      width:Alloy.Globals.osUnits(30),
                      height:Alloy.Globals.osUnits(30),
                      image:"/images/icon_left.png"
                    }),
                    listener:sliderLeftPresentation
                  };
oBtnsForMenu[4] = {
                    view:Ti.UI.createView({
                      top:Alloy.Globals.osUnits(15),
                      width:Ti.UI.SIZE,
                      height:Ti.UI.SIZE,
                      left:Alloy.Globals.osUnits(leftSeparator),
                    }),
                    icon:Ti.UI.createImageView({
                      width:Alloy.Globals.osUnits(30),
                      height:Alloy.Globals.osUnits(30),
                      image:"/images/icon_share.png"
                    }),
                    listener:sharePresentation
                  };
oBtnsForMenu[5] = {
                    view:Ti.UI.createView({
                      top:Alloy.Globals.osUnits(15),
                      width:Ti.UI.SIZE,
                      height:Ti.UI.SIZE,
                      left:Alloy.Globals.osUnits(leftSeparator),
                    }),
                    icon:Ti.UI.createImageView({
                      width:Alloy.Globals.osUnits(30),
                      height:Alloy.Globals.osUnits(30),
                      image:"/images/icon_documents.png"
                    }),
                    listener:openDocumentExplorer
                  };

oBtnsForMenu[6] = {
                    view:Ti.UI.createView({
                      top:Alloy.Globals.osUnits(15),
                      width:Ti.UI.SIZE,
                      height:Ti.UI.SIZE,
                      left:Alloy.Globals.osUnits(leftSeparator),
                    }),
                    icon:Ti.UI.createImageView({
                      width:Alloy.Globals.osUnits(30),
                      height:Alloy.Globals.osUnits(30),
                      image:"/images/icon_close.png"
                    }),
                    listener:closeShowAppPresentation
                  };
var iTotalButonsForMenu = oBtnsForMenu.length;
for (var i = 0; i < iTotalButonsForMenu; i++) {

    oBtnsForMenu[i].view.add(oBtnsForMenu[i].icon);
    oBtnsForMenu[i].view.addEventListener('click',oBtnsForMenu[i].listener);
    oMenuContent.add(oBtnsForMenu[i].view);
}

/*Boton abrir/cerrar */
var iconBtn = Ti.UI.createImageView({
  image:imageMenu
});
var oBotonOpenControls = Ti.UI.createView({
  width:Alloy.Globals.osUnits(200),
  height:Alloy.Globals.osUnits(30),
  bottom:0
});
oBotonOpenControls.add(iconBtn);
oBotonOpenControls.addEventListener('click',onClickBtnControls);
$.headerControls.add(oBotonOpenControls);

function onClickBtnControls(e){
    if(!isOpenControls){
      $.headerControls.animate(animationOpen);
      iconBtn.image = '/images/icon_up.png';
      isOpenControls = true;
    }else{
      $.headerControls.animate(animationClose);
      iconBtn.image = '/images/icon_dwon.png';
      isOpenControls = false;
    }
}
/*----------------------------------------------------------------*/
/*Leemos el Archivo config.json local para esta presentacion */
var presentationsOnlineFolder = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator +'presentations');

var aDataSliders = new DataBaseQuery().getLocalPresentationCreateForUserById(idPresentationLocal);
// Ti.API.info(aDataSliders);

  /*Parseamos el JSON y creamos los views por cada slide*/
  // var sJsonFile = indexFile.read();
  //
  // var aDataSliders = JSON.parse(sJsonFile.text);
  // Ti.API.info('ConfigFile');
  //Ti.API.info(aDataSliders);

  // documentsData = aDataSliders.documents;
  //
   var iTotalSliders = aDataSliders.Sliders.length;
   var aPresentationOnlineFolder = [];
  var aSlider = [];
  var aAppOnlienFolder = [];
  var rutaFolders = [];
  var htmlFiles = [];
  var imagesThumForIndex = [];
  var imageThumContainer = [];
  var contentItemIndex = [];
  var sTextItemNameIndex = [];
   for (var i = 0; i < iTotalSliders; i++) {
    aPresentationOnlineFolder[i] = Ti.Filesystem.getFile(presentationsOnlineFolder.resolve(), aDataSliders.Sliders[i].idPresentationOnline);
    aAppOnlienFolder[i] = Ti.Filesystem.getFile(aPresentationOnlineFolder[i].resolve(), 'app');
    rutaFolders[i] = Ti.Filesystem.getFile(aAppOnlienFolder[i].resolve(), "/sliders/"+aDataSliders.Sliders[i].folder_slider);
    htmlFiles[i] = Ti.Filesystem.getFile(rutaFolders[i].resolve(), aDataSliders.Sliders[i].folder_slider+".html");
    aSlider[i] = Ti.UI.createWebView({
      width:Ti.UI.FILL,
      height:Ti.UI.FILL,
      enableZoomControls:false,
      //scalesPageToFit:false

    });
    if(OS_IOS){
      aSlider[i].url = htmlFiles[i];
    }else{
      aSlider[i].enableJavascriptInterface = true;
      aSlider[i].data = htmlFiles[i].read();
    }

      oContentSliders.addView(aSlider[i]);
    contentItemIndex[i] = Ti.UI.createView({
      top:Alloy.Globals.osUnits(15),
      width:Alloy.Globals.osUnits(150),
      height:Alloy.Globals.osUnits(170),

      layout:"vertical"
    });
    imagesThumForIndex[i] = Ti.Filesystem.getFile(rutaFolders[i].resolve(), "ico.jpg");
    imageThumContainer[i] = Ti.UI.createImageView({

      borderColor:"#"+Alloy.Globals.conf.boton_principla_color,
      indice:i,
      image:imagesThumForIndex[i],

    });
    imageThumContainer[i].addEventListener("click",function(e){
      var indiceNumber = e.source.indice;
      oContentSliders.scrollToView(indiceNumber);

      $.indiceContainer.animate(animationCloseIndice);
      indiceIsOpen = false;

    });
    /*Texto con el nombre del slide*/
    sTextItemNameIndex[i] = Ti.UI.createLabel({
      top:Alloy.Globals.osUnits(5),
      text:aDataSliders.Sliders[i].name,
      color:"#000",
      font:{
        fontFamily:"AvenirNextLTPro-Demi",
        fontSize:12
      }
    });

    contentItemIndex[i].add(imageThumContainer[i]);
    contentItemIndex[i].add(sTextItemNameIndex[i]);
    $.indiceScroll.add(contentItemIndex[i]);
   }
   $.webCanvas.add(oContentSliders);





/*Header Close Indice*/
var contentIco = Ti.UI.createView({
  width:Alloy.Globals.osUnits(40),
  height:Alloy.Globals.osUnits(40),
});
var iconHeaderClose = Ti.UI.createImageView({
  image:"/images/icon_close.png",
});
contentIco.add(iconHeaderClose);
$.headerIndice.add(contentIco);
$.headerIndice.addEventListener("click",openIndice);


/*Eventos cde los botones del menu*/
function openIndice(e){
  if(!indiceIsOpen){
    $.indiceContainer.animate(animationOpenIndice);
    indiceIsOpen = true;
  }else{
    $.indiceContainer.animate(animationCloseIndice);
    indiceIsOpen = false;
  }
}
function openDocumentExplorer(e){
  //$.root.add(Alloy.createWidget("DocumentExplorer",{idPresentation:idPresentation, documentsData:documentsData}).getView());
  $.root.add(Alloy.createWidget("DocumentExplorerLocal",{idPresentacionLocal:idPresentationLocal}).getView());
}
function sharePresentation(e){
  alert(L('noShare'));
}
function sliderLeftPresentation(e){
  var currentIndex = oContentSliders.currentPage;
  var newIndex = currentIndex+1;
  oContentSliders.scrollToView(newIndex);
}
function sliderRightPresentation(e){
  var currentIndex = oContentSliders.currentPage;
  var newIndex = currentIndex-1;
  oContentSliders.scrollToView(newIndex);
}
function gotoHomePresentation(e){
  oContentSliders.scrollToView(0);
}
function closeShowAppPresentation(e){
  $.root.close();
}
