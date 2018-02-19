var args = $.args || {};
var DataBaseQuery = require("DataBaseQuery");
var aData = args.aDataPresentation;
var colorBorder = "#"+Alloy.Globals.conf.text_form_color;
var colorBtn = "#"+Alloy.Globals.conf.boton_principla_color;
var colorTitle = "#"+Alloy.Globals.conf.boton_back_color;
var backColor = "#"+Alloy.Globals.conf.background_color;
var aBotonsForPresentation = [];
var widgetLoaderPresentation;
var forLocal = false;
var needUpdate = false;
var geo = require('ti.geolocation.helper');
var Estadisticas = require("Estadisticas");


/*Validamos si la presentacion existe en la base de datos local o no*/
var aDataLocal = new DataBaseQuery().getPresentation(aData.id_presentation);

if(aDataLocal.idPresentation>0){
  forLocal = true;
}else{
  forLocal = false;
}
var localVersion = Number(aDataLocal.version);
var onlineVersion = Number(aData.version);
if(onlineVersion>localVersion){
  needUpdate = true;
}
// Ti.API.info('Versiones');
// Ti.API.info('Local: '+aDataLocal.version+"------- OLnline"+aData.version);
// Ti.API.info('Data Presentation');
// Ti.API.info(JSON.stringify(aData));
// Ti.API.info('Local or Online');
// Ti.API.info(JSON.stringify(aDataLocal));



/*LEFT*/
var leftSlide = Ti.UI.createView({
  width: "50%",
  height:Ti.UI.FILL,
  backgroundColor: backColor,
  layout:"vertical"
});
var sidesContainer = Ti.UI.createView({
  width:Ti.UI.FILL,
  height:Ti.UI.FILL,
  backgroundColor:"transparent",
  layout:"horizontal",
  borderColor: colorBorder,
  borderWidth: Alloy.Globals.osUnits(1)
});
sidesContainer.add(leftSlide);

/*RIGHT*/
var rightSide = Ti.UI.createView({
  width: "50%",
  height:Ti.UI.FILL,
  backgroundColor:"transparent"
});
sidesContainer.add(rightSide);


/*LEFT SIDE CONTENT*/
var oTitulo =  Ti.UI.createLabel({
  top:Alloy.Globals.osUnits(20),
  text:aData.name,
  color:colorTitle,
  font:{
    fontFamily:"AvenirNextLTPro-Bold",
    fontSize:Alloy.Globals.osUnits(40)
  }
});
leftSlide.add(oTitulo);
var oImageContent = Ti.UI.createView({
  top: Alloy.Globals.osUnits(20),
  width: Alloy.Globals.osUnits(430),
  height: Alloy.Globals.osUnits(330),
});
leftSlide.add(oImageContent);
var oImage = Ti.UI.createImageView({
  width:Ti.UI.FILL,
  height:Ti.UI.FILL,
  image:aData.url_image_big,
  defaultImage:"/images/defaul_image_presentation_window.jpg"
});
oImageContent.add(oImage);

var oMenuContent = Ti.UI.createScrollView({
  top:Alloy.Globals.osUnits(20),
  width: Ti.UI.FILL,
  height:Ti.UI.SIZE,
  layout:"horizontal"
});
aBotonsForPresentation[0] = {Btn:Ti.UI.createButton({
                                    left:Alloy.Globals.osUnits(10),
                                    width: Alloy.Globals.osUnits(120),
                                    height: Alloy.Globals.osUnits(40),
                                    backgroundColor: colorBtn,
                                    title:L('download'),
                                    color:"#FFF"

                            }),
                            listener:onClickDownloadPresentation,
                            showLocal:false
};

aBotonsForPresentation[1] = {Btn:Ti.UI.createButton({
                                    left:Alloy.Globals.osUnits(10),
                                    width: Alloy.Globals.osUnits(120),
                                    height: Alloy.Globals.osUnits(40),
                                    backgroundColor: colorBtn,
                                    title:L('viewPress'),
                                    color:"#FFF"

                            }),
                            listener:onClickViewLocalPresentation,
                            showLocal:true
};
aBotonsForPresentation[2] = {Btn:Ti.UI.createButton({
                                    left:Alloy.Globals.osUnits(10),
                                    width: Alloy.Globals.osUnits(120),
                                    height: Alloy.Globals.osUnits(40),
                                    backgroundColor: colorBtn,
                                    title:L('deletePress'),
                                    color:"#FFF"

                            }),
                            listener:onClickDeletePress,
                            showLocal:true
};

for(var i=0;i<aBotonsForPresentation.length;i++){
  /*Solo se muestran estos botones para las presentaciones online*/
  if(forLocal){
    if(aBotonsForPresentation[i].showLocal){
      oMenuContent.add(aBotonsForPresentation[i].Btn);
      aBotonsForPresentation[i].Btn.addEventListener("click",aBotonsForPresentation[i].listener);
    }
  }else{
      if(!aBotonsForPresentation[i].showLocal){
      /*Presentaciones Descargadas muestran esrtos Botones*/
      oMenuContent.add(aBotonsForPresentation[i].Btn);
      aBotonsForPresentation[i].Btn.addEventListener("click",aBotonsForPresentation[i].listener);
    }
  }
}
/*Aqui agregamos el boton de update*/
if(needUpdate){
  Ti.API.info('Entro a update APP');
  var oBtnUpdate = Ti.UI.createButton({
                                      left:Alloy.Globals.osUnits(10),
                                      width: Alloy.Globals.osUnits(120),
                                      height: Alloy.Globals.osUnits(40),
                                      backgroundColor: "#"+Alloy.Globals.conf.boton_delete_color,
                                      title:L('updatePress'),
                                      color:"#FFF"
                              });
  oBtnUpdate.addEventListener("click",onClickDownloadPresentation);
  oMenuContent.add(oBtnUpdate);
}
leftSlide.add(oMenuContent);
/*END LEFT SIDE CONTENT*/

/*Switch para saber si queremos que sea slider o no*/
var contentSwitch =Ti.UI.createView({
  left:Alloy.Globals.osUnits(40),
  top:Alloy.Globals.osUnits(20),
  width:Ti.UI.FILL,
  height:100,
  layout:"horizontal"
});
var labelForSwitch = Ti.UI.createLabel({
  color:colorTitle,
  font:{
    fontFamily:"AvenirNextLTPro-Regular",
    fontSize:16
  },
  text:L('switchAsSlider')
});
contentSwitch.add(labelForSwitch);
var oSwithsSlider = Ti.UI.createSwitch({
  left:Alloy.Globals.osUnits(5),
  value:Alloy.Globals.isSliderPresentation // mandatory property for iOS
});
oSwithsSlider.addEventListener("change",function(){
    Alloy.Globals.isSliderPresentation = oSwithsSlider.value;
});
contentSwitch.add(oSwithsSlider);
leftSlide.add(contentSwitch);
/*END Switch*/


/*RIGHT SIDE CONTENT*/
var oLabelDescription = Ti.UI.createLabel({
  width:"80%",
  height:Ti.UI.SIZE,
  text:aData.description,
  color:colorBorder,
  font:{
    fontFamily:"AvenirNextLTPro-Regular",
    fontSize:Alloy.Globals.osUnits(18)
  }
});
rightSide.add(oLabelDescription);
/*END RIGHT SIDE CONTENT*/

/*Eventos de los botones del menu de presentacion*/
function onClickDownloadPresentation(e){
    //Ti.API.info(Alloy.Globals.categoryBreadCrum);
    /*Obtenemos la URL del Package para que se descargue, se descomprima y se guarde*/
    widgetLoaderPresentation = Alloy.createWidget("DownloaderPresentation",{aData:aData,isUpdate:needUpdate}).getView("root");
    $.root.add(widgetLoaderPresentation);
    widgetLoaderPresentation.addEventListener("presentationSaved",onLoaderAppIsOk);

    /*Grbamos la estadistica de descarga de presentacion*/
    geo.getLocation({success:onSuccesLocation , error:onErrorLocation });
    var oneRecInServer = 1;
    function onSuccesLocation(e){
      //if(oneRecInServer==1){
        //alert("LocalizacionOK")
        //Ti.API.info(e);
        var ts = Math.round((new Date()).getTime() / 1000);
        var aDataToStadistic = {
                                idUser:Alloy.Globals.id_user,
                                idPresentation:aData.id_presentation,
                                latitud:e.latitude,
                                longitud:e.longitude,
                                fecha_hora:ts
                                }
        var oEstadistica = new Estadisticas().saveEstadisticsDownload(aDataToStadistic);
        oEstadistica.onerror = function(evt){
          //Ti.API.debug(evt.error);
          //alert("Error al grabar la estadistica de descarga");
          new DataBaseQuery().setEstadisticInLocal(aDataToStadistic);

        }
        Ti.API.info('Si hay gelolocalizacion');

      //}
      oneRecInServer++;
    }
    function onErrorLocation(e){
      var ts = Math.round((new Date()).getTime() / 1000);
      var aDataToStadistic = {
                              idUser:Alloy.Globals.id_user,
                              idPresentation:aData.id_presentation,
                              latitud:0,
                              longitud:0,
                              fecha_hora: ts
                              }
      var oEstadistica = new Estadisticas().saveEstadisticsDownload(aDataToStadistic);
      oEstadistica.onerror = function(evt){
        //Ti.API.debug(evt.error);
        //alert("Error al grabar la estadistica de descarga");
        new DataBaseQuery().setEstadisticInLocal(aDataToStadistic);
      }
      Ti.API.info('NO hay gelolocalizacion');
    }
    //oneRecInServer++;

}

function onClickViewLocalPresentation(e){
  Alloy.createWidget("ShowApp",{dataPresentation:aData}).getView().open({modal:true});
}
function onClickDeletePress(e){
  //alert("Borrar");
  var dialog = Ti.UI.createAlertDialog({
    message:L('questionDeletePresentation'),
    buttonNames: [L('yes'), L('no')],
   title: L('deletePresentationTitle')
  });
  dialog.addEventListener("click",function(e){
    ///Ti.API.info('Cerrar session: '+e.index);
    var isClose =e.index;
    if(isClose==0){
      deletePresentationOk();
    }
  });
  dialog.show();
}
function deletePresentationOk(){

  if(new DataBaseQuery().deletePresentationRecord(aData.id_presentation)){
    Alloy.Globals.categoryBreadCrum = [];
    $.root.close();
    Alloy.Globals.navWindow.popToRootWindow();
  }
}

function onLoaderAppIsOk(e){
    /*Eliminamos el widget de carga de la presentacion*/
    $.root.remove(widgetLoaderPresentation);
    widgetLoaderPresentation = null;

    /*Cargamos la window de show presentacion y crerramos esta ventana*/
    $.root.close();
    Alloy.createWidget("ShowApp",{dataPresentation:aData}).getView().open({modal:true});

}



/*Se carga el HEader*/
$.canvasRoot.add(Alloy.createController("HeaderUser",{isModal:true,toClose:$.root}).getView());

/*Se carga el Sides Container*/
$.canvasRoot.add(sidesContainer);
