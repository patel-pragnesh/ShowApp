var args = $.args || {};
var pressData = args.aData;
var colorTitle = "#"+Alloy.Globals.conf.boton_back_color;
var backColorApp = "#"+Alloy.Globals.conf.background_color;
/*Leemos el JSON de cada presentacion*/
var presentationsFolder = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator +'presentations');
var presentationIdFolder = Ti.Filesystem.getFile(presentationsFolder.resolve(), pressData.idOnLine);
var appFolder = Ti.Filesystem.getFile(presentationIdFolder.resolve(), 'app');
var indexFile = Ti.Filesystem.getFile(appFolder.resolve(), 'config.json');
if(indexFile.exists()){
  /*Parseamos el JSON y creamos los views por cada slide*/
  var sJsonFile = indexFile.read();
  var aDataSliders = JSON.parse(sJsonFile.text);
  builtSliders(aDataSliders);

}else{
  alert("Error en la presentacion: "+pressData.name);
}


function builtSliders(aPress){


  /*Agregamos el titulo de la presentacion*/
  var oPressTitle = Ti.UI.createLabel({
    left:Alloy.Globals.osUnits(10),
    top:Alloy.Globals.osUnits(10),
    width:Ti.UI.SIZE,
    height:Ti.UI.SIZE,
    text:pressData.name,
    color:colorTitle,
    font:{
      fontFamily:"ProximaNova-Black",
      fontSize:16
    }
  });
  $.canvasPress.add(oPressTitle);

  var scrollSliders = Ti.UI.createScrollView({
    top:Alloy.Globals.osUnits(5),
    width:Ti.UI.FILL,
    height:Alloy.Globals.osUnits(175),
    backgroundColor: 'transparent',
    layout: 'horizontal'
  });

  var iTotalSliders = aPress.sliders.length;
  var aSliderContentView = [];
  var rutaFolders = [];
  var imageContentForSlider = [];
  var imageThumSlider = [];
  var imagenContent = []
  var aContentButtons = [];
  var botonView = [];
  var botonAddToNew = [];
  var imageView=[];
  var imagePlus = [];
  //var oDocumentsContent= [];

  for (var i = 0; i < iTotalSliders; i++) {
    rutaFolders[i] = Ti.Filesystem.getFile(appFolder.resolve(), "/sliders/"+aPress.sliders[i].folder);
    imageThumSlider[i] = Ti.Filesystem.getFile(rutaFolders[i].resolve(), "ico.jpg");
    imagenContent[i] = Ti.UI.createImageView({
      top:0,
      image:imageThumSlider[i]
    });
    aSliderContentView[i] = Ti.UI.createView({
      top:0,
      left:Alloy.Globals.osUnits(10),
      width:Alloy.Globals.osUnits(150),
      height:Ti.UI.FILL,
      backgroundColor:"transparent",
      layout:"vertical"
    });
    aSliderContentView[i].add(imagenContent[i]);
    aContentButtons[i] = Ti.UI.createView({
      width:Ti.UI.FILL,
      height:Alloy.Globals.osUnits(25),
      backgroundColor:"transparent",
      layout:"horizontal"
    });
    aSliderContentView[i].add(aContentButtons[i]);
    imageView[i] = Ti.UI.createImageView({image:"/images/icon_view.png"});
    botonView[i] = Ti.UI.createButton({
      width:"50%",
      height:Alloy.Globals.osUnits(25),
      urlSlider:aPress.sliders[i],
      image:"/images/icon_view.png"
    });
    //botonView[i].add(imageView[i]);
    botonView[i].addEventListener("click",function(e){
      var urlToOpen = e.source.urlSlider;
      openSlider(urlToOpen);
    })
    aContentButtons[i].add(botonView[i]);

    imagePlus[i] = Ti.UI.createImageView({image:"/images/icon_plus.png"});
    botonAddToNew[i] = Ti.UI.createButton({
      width:"50%",
      height:Alloy.Globals.osUnits(25),
      sliderToAdd:aPress.sliders[i],
      //image:"/images/icon_plus.png",
      title:"+",
      font:{
        fontFamily:"ProximaNova-Black",
        fontSize:20
      },
      color:colorTitle,
      backgroundColor:"transparent"
    });
    //botonAddToNew[i].add(imagePlus[i]);
    botonAddToNew[i].addEventListener("click",function(e){
      var dataToAdd = e.source.sliderToAdd;

      /*Este evento se ejecurta en el archivo TableWidthNewSliders.js del widget CreatePresentation*/
      Ti.App.fireEvent("onSelctSliderToAddNew",{oSlider:dataToAdd,idPresentation:pressData.idOnLine,aDataPress:aPress});
    });
    aContentButtons[i].add(botonAddToNew[i]);


    scrollSliders.add(aSliderContentView[i]);

  }
  $.canvasPress.add(scrollSliders);

  /*Agregamos el Contenedor de documentos*/
  var oDocumentsContent = Ti.UI.createScrollView({
    left:Alloy.Globals.osUnits(10),
    width:Alloy.Globals.osUnits(600),
    height:Ti.UI.FILL,
    backgroundColor:"transparent",
    layout:"vertical"
  });
  $.canvasPress.add(oDocumentsContent);
  Ti.API.info('config.json');
  Ti.API.info(aPress);
  /*Leemos la informacion de los documentos adjuntos*/
  var aDocuments = aPress.documents;
  var iTotalDocuments = aDocuments.length;
  var oItemsDocument = [];
  var labelDocument = [];
  for (var i = 0; i < iTotalDocuments; i++) {
    labelDocument[i] = Ti.UI.createLabel({
      width:Ti.UI.SIZE,
      height:Ti.UI.FILL,
      left:Alloy.Globals.osUnits(10),
      color:colorTitle,
      font:{
        fontFamily:"ProximaNova-Regular",
        fontSize:15,
      },
      text:aDocuments[i].name
    });
    oItemsDocument[i] = Ti.UI.createView({
      top:Alloy.Globals.osUnits(3),
      width:Ti.UI.FILL,
      height:Alloy.Globals.osUnits(40),
      backgroundColor:Alloy.Globals.colorLuminosity(backColorApp,-0.01),
      layout:"horizontal"
    });
    oItemsDocument[i].add(labelDocument[i]);
    oDocumentsContent.add(oItemsDocument[i]);
  }
}




function openSlider(urlSlider){
  Widget.createController("WindowViewSlide",{dataSlider:urlSlider, idPress:pressData.idOnLine}).getView().open({modal:true});
}
