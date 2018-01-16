var args = $.args || {};
var aData = args.aDataPresentation;
var colorBorder = "#"+Alloy.Globals.conf.text_form_color;
var colorBtn = "#"+Alloy.Globals.conf.boton_principla_color;
var colorTitle = "#"+Alloy.Globals.conf.boton_back_color;
var backColor = "#"+Alloy.Globals.conf.background_color;
var aBotonsForPresentation = [];
var widgetLoaderPresentation;

//Ti.API.info(aData);

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
  image:aData.url_image_big
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
                                    title:"Descargar",
                                    color:"#FFF"
                            }),
                            listener:onClickDownloadPresentation
};
for(var i=0;i<aBotonsForPresentation.length;i++){
  oMenuContent.add(aBotonsForPresentation[i].Btn);
  aBotonsForPresentation[i].Btn.addEventListener("click",aBotonsForPresentation[i].listener);
}
leftSlide.add(oMenuContent);
/*END LEFT SIDE CONTENT*/

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
    widgetLoaderPresentation = Alloy.createWidget("DownloaderPresentation",{aData:aData}).getView("root");
    $.root.add(widgetLoaderPresentation);
    widgetLoaderPresentation.addEventListener("presentationSaved",onLoaderAppIsOk);
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
