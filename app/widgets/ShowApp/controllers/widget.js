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
var oWebView = Ti.UI.createWebView({
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
                      width:Alloy.Globals.osUnits(20),
                      height:Alloy.Globals.osUnits(20),
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
                      width:Alloy.Globals.osUnits(20),
                      height:Alloy.Globals.osUnits(20),
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

                      width:Alloy.Globals.osUnits(20),
                      height:Alloy.Globals.osUnits(20),
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
                      width:Alloy.Globals.osUnits(20),
                      height:Alloy.Globals.osUnits(20),
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
var indexFile = Ti.Filesystem.getFile(appFolder.resolve(), 'index.html');
if(indexFile.exists()){
  /*Creamos el Web View*/
  oWebView.url = indexFile;
  $.webCanvas.add(oWebView);

}else{
  alert("Error al leer la presentacion estructura incorrecta falta archivo index.html");
}


/*Eventos cde los botones del menu*/
function sliderLeftPresentation(e){

}
function sliderRightPresentation(e){

}
function gotoHomePresentation(e){

}
function closeShowAppPresentation(e){
  $.root.close();
}
