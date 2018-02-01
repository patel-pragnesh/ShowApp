var CreateDataBase = require("CreateDataBase");
var DataBaseQuery = require("DataBaseQuery");
var backgroundColorBase =  "#"+Alloy.Globals.conf.background_color_left_bar;
var text_title_color = "#"+Alloy.Globals.conf.text_title_color;
var closeSessionColor = "#"+Alloy.Globals.conf.boton_back_color;

//var imageLogo = Alloy.Globals.conf.image_url;
//Ti.API.info('Image Logo'+imageLogo);

$.leftBar.backgroundColor = backgroundColorBase;

/*Imagen del logo*/
var oFolderLogo = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'company');
var imageData = Ti.Filesystem.getFile(oFolderLogo.resolve(),'logo.jpg');
if(imageData.exists()){
  $.imageLogoCompany.image = imageData;
}
$.closeSession.backgroundColor = closeSessionColor;
$.closeSession.title = L('closeSession');

var aBotonForMenu = [];
aBotonForMenu[0] = {Btn:Ti.UI.createView({
                      width:Alloy.Globals.osUnits(123),
                      height:Alloy.Globals.osUnits(123),
                      backgroundColor:"#FFF",
                      borderRadius:Alloy.Globals.osUnits(10),
                  }),
                  Txt:Ti.UI.createLabel({
                    bottom:Alloy.Globals.osUnits(10),
                    text:L('myPresentations'),
                    color:text_title_color,
                    font:{
                      fontFamily:"AvenirNextLTPro-Demi",
                      fontSize:Alloy.Globals.osUnits(12)
                    }
                  }),
                  listener:onClickMyPresentations
                };
aBotonForMenu[1] = {Btn:Ti.UI.createView({
                      top:Alloy.Globals.osUnits(15),
                      width:Alloy.Globals.osUnits(123),
                      height:Alloy.Globals.osUnits(123),
                      backgroundColor:"#FFF",
                      borderRadius:Alloy.Globals.osUnits(10),

                  }),
                  Txt:Ti.UI.createLabel({
                    bottom:Alloy.Globals.osUnits(10),
                    text:L('newPresentation'),
                    color:text_title_color,
                    font:{
                      fontFamily:"AvenirNextLTPro-Demi",
                      fontSize:Alloy.Globals.osUnits(12)
                    }
                  }),
                  listener:onClickNewPresentation
                };
var iTotalBotonesMenu = aBotonForMenu.length;
for (var i = 0; i < iTotalBotonesMenu; i++) {
  aBotonForMenu[i].Btn.addEventListener("click",aBotonForMenu[i].listener);
  aBotonForMenu[i].Btn.add(aBotonForMenu[i].Txt);
  $.menuContent.add(aBotonForMenu[i].Btn);
}

$.closeSession.addEventListener("click",onClickCloseSession);
function onClickCloseSession(){
  var dialog = Ti.UI.createAlertDialog({
    message:L('closeSessionQuestion'),
    buttonNames: [L('yes'), L('no')],
   title: L('closeSession')
  });
  dialog.addEventListener("click",function(e){
    ///Ti.API.info('Cerrar session: '+e.index);
    var isClose =e.index;
    if(isClose==0){
      closeSessionOkUser();
    }
  });
  dialog.show();
}

function closeSessionOkUser(){
  /*Primero borramos todos los archivos*/
  var presentationsFolder = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator +'presentations');
  presentationsFolder.deleteDirectory(true);

  /*Ahora borramos la base de datos*/
  if(new DataBaseQuery().deleteAllDataBase()){
    /*Ahora creamos la Base otra vez*/
    new CreateDataBase();

    /*Ejecutamos el evento se avisa sobre el cierre de sesion revisar index.js*/
    Ti.App.fireEvent("closeSession",{});
  }
}

function onClickMyPresentations(e){
  Alloy.createWidget("MyPresenattions",{}).getView().open({modal:true});
}

function onClickNewPresentation(e){
  Alloy.createWidget("CreatePresentation",{}).getView().open({modal:true});
}
