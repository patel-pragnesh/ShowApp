var args = $.args || {};
var pressData = args.aData;
var colorTitle = "#"+Alloy.Globals.conf.boton_back_color;
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
    top:Alloy.Globals.osUnits(5),
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
    height:Ti.UI.FILL,
    backgroundColor: 'transparent',
    layout: 'horizontal'
  });

  var iTotalSliders = aPress.sliders.length;
  var aSliderContentView = [];
  var rutaFolders = [];
  var imageContentForSlider = [];
  var imageThumSlider = [];
  var imagenContent = []
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
      backgroundColor:"orange"
    });
    aSliderContentView[i].add(imagenContent[i]);
    scrollSliders.add(aSliderContentView[i]);

  }
  $.canvasPress.add(scrollSliders);
}
