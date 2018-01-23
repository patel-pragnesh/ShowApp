var args = $.args || {};
var idPresentation = args.dataPresentation.id_presentation;
var isOpenControls = false;
var animationOpen = Ti.UI.createAnimation();
animationOpen.top = 0;
animationOpen.duration = 500;
var animationClose =  Ti.UI.createAnimation();
animationClose.top = Alloy.Globals.osUnits(-50);
animationClose.duration = 500;
var imageMenu = '/images/icon_dwon.png';
// var oWebView = Ti.UI.createWebView({
//   width:Ti.UI.FILL,
//   height:Ti.UI.FILL,
// });

var oContentSliders = Ti.UI.createScrollableView({
  width:Ti.UI.FILL,
  height:Ti.UI.FILL,
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
                      left:Alloy.Globals.osUnits(10),
                    }),
                    icon:Ti.UI.createImageView({
                      width:Alloy.Globals.osUnits(30),
                      height:Alloy.Globals.osUnits(30),
                      image:"/images/icon_right.png"
                    }),
                    listener:sliderRightPresentation
                  };
oBtnsForMenu[2] = {
                    view:Ti.UI.createView({
                      top:Alloy.Globals.osUnits(15),
                      width:Ti.UI.SIZE,
                      height:Ti.UI.SIZE,
                      left:Alloy.Globals.osUnits(10),
                    }),
                    icon:Ti.UI.createImageView({

                      width:Alloy.Globals.osUnits(30),
                      height:Alloy.Globals.osUnits(30),
                      image:"/images/icon_left.png"
                    }),
                    listener:sliderLeftPresentation
                  };
oBtnsForMenu[3] = {
                    view:Ti.UI.createView({
                      top:Alloy.Globals.osUnits(15),
                      width:Ti.UI.SIZE,
                      height:Ti.UI.SIZE,
                      left:Alloy.Globals.osUnits(10),
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
/*Leemos el Archivo index.html local para esta presentacion */
var presentationsFolder = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator +'presentations');
var presentationIdFolder = Ti.Filesystem.getFile(presentationsFolder.resolve(), idPresentation);
var appFolder = Ti.Filesystem.getFile(presentationIdFolder.resolve(), 'app');
var indexFile = Ti.Filesystem.getFile(appFolder.resolve(), 'config.json');
if(indexFile.exists()){
  /*Parseamos el JSON y creamos los views por cada slide*/
  var sJsonFile = indexFile.read();

  var aDataSliders = JSON.parse(sJsonFile.text);
  Ti.API.info('ConfigFile');
  //Ti.API.info(aDataSliders);

  var iTotalSliders = aDataSliders.sliders.length;
  var aSlider = [];
  var rutaFolders = [];
  var htmlFiles = [];
  for (var i = 0; i < iTotalSliders; i++) {
    rutaFolders[i] = Ti.Filesystem.getFile(appFolder.resolve(), "/sliders/"+aDataSliders.sliders[i].folder);
    htmlFiles[i] = Ti.Filesystem.getFile(rutaFolders[i].resolve(), aDataSliders.sliders[i].folder+".html");
    aSlider[i] = Ti.UI.createWebView({
      width:Ti.UI.FILL,
      height:Ti.UI.FILL,
    });
    if(OS_IOS){
      aSlider[i].url = htmlFiles[i];
    }else{
      aSlider[i].enableJavascriptInterface = true;
      aSlider[i].data = htmlFiles[i].read();
    }

    oContentSliders.addView(aSlider[i]);
  }
  $.webCanvas.add(oContentSliders);
  // Ti.API.info('HTML 1');
  // Ti.API.info(htmlFiles[0].read());



}else{
  alert(L('noConfigJson'));
}


/*Eventos cde los botones del menu*/
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
