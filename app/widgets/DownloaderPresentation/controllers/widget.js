var args = $.args || {};
Ti.API.info(args);
var backColor = "#"+Alloy.Globals.conf.boton_principla_color;
var titlesColor = "#"+Alloy.Globals.conf.boton_back_color;
var idCategory = args.aData.pivot.id_category_parent;
var idPresentation = args.aData.id_presentation;
var zip = require('ti.compression');
var DataBaseQuery = require("DataBaseQuery");
var saveImages = 0;
var numImagesToSave = 2;
var isUpdate = args.isUpdate;

$.backTrans.backgroundColor = backColor;
$.titulo.text = args.aData.name;
$.titulo.color = titlesColor;
$.subTitulo.color = titlesColor;
$.subTitulo.text = L('subTitleLoader');
$.percentNumber.color = titlesColor;

/*Cargamos el ZIP*/
var oConnection = Titanium.Network.createHTTPClient({timeout:Alloy.Globals.timeOutWebServices});
var url = Alloy.Globals.weburl+"/apps/"+idPresentation+"/"+args.aData.url_package;
//Ti.API.info('URL CARGA');
//Ti.API.info(url);
oConnection.open("GET",url);
oConnection.send({});
oConnection.onload = function(){
  $.percentNumber.text = L('processing');

  var blobFile = this.responseData;

  /**/
  /*Creamos el directorio de presentaciones en caso de que no exista*/
  var dirForPresentations = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'presentations');
  if(!dirForPresentations.exists()){
    dirForPresentations.createDirectory();
  }

  /*Ahora creamos el Directorio para la presentacion con su Id_online de prresentacion */
  var dirForPresentation = Ti.Filesystem.getFile(dirForPresentations.resolve(), idPresentation);
  if(!dirForPresentation.exists()){
    dirForPresentation.createDirectory();
  }

  /*Creamos el directorio para las imagenes de la presentacion*/
  var dirForImagesPresentation = Ti.Filesystem.getFile(dirForPresentation.resolve(), 'images_presentation');
  if(!dirForImagesPresentation.exists()){
    dirForImagesPresentation.createDirectory();
  }

  /*Creaamos temporalmente un archivo que es el zip para que pueda ser descomprimido*/
  var tempZipFile = Ti.Filesystem.getFile(dirForPresentation.resolve(),'tmp_file.zip');
  tempZipFile.write(blobFile);
  //Ti.API.info(tempZipFile);

  unzipFile();

};
oConnection.onerror = function(){
  $.root.parent.remove($.root);
  $.root = null;
  alert(L('loaderPressError'));
};
oConnection.ondatastream = function(e){
  var porcentajeCarga = Math.round((e.progress*100));
  $.loaderBar.width = porcentajeCarga+"%";
  $.percentNumber.text = porcentajeCarga+"%";
  //Ti.API.info('ONDATASTREAM - PROGRESS: ' + (e.progress*100));
};

function unzipFile(){

  var tempZipFile = Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + 'presentations' + Ti.Filesystem.separator + idPresentation + Ti.Filesystem.separator + 'tmp_file.zip';
    var result = zip.unzip(Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + 'presentations' + Ti.Filesystem.separator + idPresentation, tempZipFile, true);
    if(result){

      //Borramos el archivo temporal

      var fFileToDelete = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + 'presentations' + Ti.Filesystem.separator + idPresentation , 'tmp_file.zip');
      fFileToDelete.deleteFile();

      /*Se guardan las dos imagenes de la presentacion*/
      downloadAndSaveImagesPresentation(args.aData.url_image_big,'big');
      downloadAndSaveImagesPresentation(args.aData.url_image_thum,'thum');

      //Ti.API.info('BreadCrum'+ Alloy.Globals.categoryBreadCrum);

    }else{
      alert(L('unzipError'));
    }

}

function downloadAndSaveImagesPresentation(imageURL,size){
  var oConnectionImage = Ti.Network.createHTTPClient({timeout:Alloy.Globals.timeOutWebServices});
  var urlImage = imageURL;
  oConnectionImage.open('GET',urlImage);
  oConnectionImage.send({});
  oConnectionImage.onload = function(){
    /*Se guarda la imagen en la carpeta de la presentacion*/
    var blobFile = this.responseData;
    var folderToSave = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + 'presentations' + Ti.Filesystem.separator + idPresentation +  Ti.Filesystem.separator + 'images_presentation');
    //Ti.API.info(folderToSave.exists());
    var nameImage = Ti.Filesystem.getFile(folderToSave.resolve(), 'img_'+size+'.jpg');
    if(!nameImage.exists()){
      nameImage.write(blobFile);
    }

    saveImages++;
    $.root.fireEvent('imageSaved',{imageNum:saveImages});
  }
  oConnectionImage.onerror = function(){
    Ti.API.info('Error al descargar la imagen');
  }

}

$.root.addEventListener('imageSaved',onSaveImage);
function onSaveImage(e){
  // Ti.API.info('imagenes salvadas');
  // Ti.API.info(e.imageNum);
  var imagesSaved = e.imageNum;
  if(imagesSaved===numImagesToSave){

    saveInDataBaseCategoryAndPresentation();

  }
}

function saveInDataBaseCategoryAndPresentation(){
  /*Traemos los datos de la categorias*/
  var aDataBreadCrum = Alloy.Globals.categoryBreadCrum;
  var iTotalLevels = aDataBreadCrum.length;
  // Ti.API.info("Levels: "+aDataBreadCrum);
  for (var i = 0; i < iTotalLevels; i++) {
      //Ti.API.info(aDataBreadCrum[i]);
      var oForSaveCategory = {
        id_category:aDataBreadCrum[i].id_category,
        category_type:aDataBreadCrum[i].category_type,
        category_name:aDataBreadCrum[i].name
      }
      // Ti.API.info('Object For Save Catrgory');
      // Ti.API.info(oForSaveCategory);
      new DataBaseQuery().setCategory(oForSaveCategory);
      if(i>0){
        /*Grabamos la relacion de las categorias*/
        new DataBaseQuery().setRelationCategoryToCategory(aDataBreadCrum[i-1].id_category, aDataBreadCrum[i].id_category);
      }

  }
  var oDataPresentationForSave = {
    id_presentation: idPresentation,
    name: args.aData.name,
    version: args.aData.version,
    url_image_big: args.aData.url_image_big,
    url_image_thum: args.aData.url_image_thum,
    url_package: args.aData.url_package,
    description: args.aData.description
  }
  if(isUpdate){
    new DataBaseQuery().updateVersionPresentation(oDataPresentationForSave);
  }else{
    new DataBaseQuery().setPresentation(oDataPresentationForSave);
  }
  /*Grabamos la relacion de la presentacion con su categoria*/
  new DataBaseQuery().setRelationCategoryToPresentation(aDataBreadCrum[iTotalLevels-1].id_category, idPresentation);

    /*Cerramos el Widget y abrimos la Window con la presentacion*/
    //$.root.fireEvent("presentationSaved",{});
    createImagesThumForIndexPresentation();

}

/*Generamos las imagenes Thum para el indice */
function createImagesThumForIndexPresentation (){
  /*Primero leemos el JSON de la presentacion*/
  /*Leemos el Archivo index.html local para esta presentacion */
  var presentationsFolder = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator +'presentations');
  var presentationIdFolder = Ti.Filesystem.getFile(presentationsFolder.resolve(), idPresentation);
  var appFolder = Ti.Filesystem.getFile(presentationIdFolder.resolve(), 'app');
  var indexFile = Ti.Filesystem.getFile(appFolder.resolve(), 'config.json');
  if(indexFile.exists()){
    /*Parseamos el JSON y creamos los views por cada slide*/
    var sJsonFile = indexFile.read();

    var aDataSliders = JSON.parse(sJsonFile.text);
    //Ti.API.info('ConfigFile');
    //Ti.API.info(aDataSliders);

    var iTotalSliders = aDataSliders.sliders.length;
    var aSlider = [];
    var rutaFolders = [];
    var htmlFiles = [];
    var thumImages = [];
    var imageNameThum = [];
    for (var i = 0; i < iTotalSliders; i++) {
      rutaFolders[i] = Ti.Filesystem.getFile(appFolder.resolve(), "/sliders/"+aDataSliders.sliders[i].folder);
      htmlFiles[i] = Ti.Filesystem.getFile(rutaFolders[i].resolve(), aDataSliders.sliders[i].folder+".html");
      aSlider[i] = Ti.UI.createWebView({
        width:Ti.UI.FILL,
        height:Ti.UI.FILL,
      });
      if(OS_IOS){
        aSlider[i].url = htmlFiles[i];
      //  thumImages[i] = aSlider[i].toImage(null,true);
      }else{
        aSlider[i].enableJavascriptInterface = true;
        aSlider[i].data = htmlFiles[i].read();

        //thumImages[i] = aSlider[i].toImage().media;
      }


    }

    $.root.fireEvent("presentationSaved",{});
    // Ti.API.info('HTML 1');
    // Ti.API.info(htmlFiles[0].read());

  }else{
    alert(L('noConfigJson'));
  }
}
