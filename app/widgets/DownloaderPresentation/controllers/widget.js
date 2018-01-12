var args = $.args || {};
var backColor = "#"+Alloy.Globals.conf.boton_principla_color;
var titlesColor = "#"+Alloy.Globals.conf.boton_back_color;
var idCategory = args.aData.pivot.id_category_parent;
var idPresentation = args.aData.id_presentation;
var zip = require('ti.compression');
var saveImages = 0;
var numImagesToSave = 2;

$.backTrans.backgroundColor = backColor;
$.titulo.text = args.aData.name;
$.titulo.color = titlesColor;
$.subTitulo.color = titlesColor;
$.subTitulo.text = L('subTitleLoader');
$.percentNumber.color = titlesColor;

/*Cargamos el ZIP*/
var oConnection = Titanium.Network.createHTTPClient({timeout:Alloy.Globals.timeOutWebServices});
var url = Alloy.Globals.weburl+"/apps/"+idCategory+"/"+args.aData.url_package;
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
  Ti.API.info(tempZipFile);

  unzipFile();
  /**/
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
    if(OS_IOS){

        var tempZipFile = Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + 'presentations' + Ti.Filesystem.separator + idPresentation + Ti.Filesystem.separator + 'tmp_file.zip';
          var result = zip.unzip(Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + 'presentations' + Ti.Filesystem.separator + idPresentation, tempZipFile, true);
          if(result){
            /*Borramos el archivo temporal*/
            var fFileToDelete = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + 'presentations' + Ti.Filesystem.separator + idPresentation , 'tmp_file.zip');
            fFileToDelete.deleteFile();

            /*Se guardan las dos imagenes de la presentacion*/
            downloadAndSaveImagesPresentation(args.aData.url_image_big,'big');
            downloadAndSaveImagesPresentation(args.aData.url_image_thum,'thum');

            Ti.API.info('BreadCrum'+ Alloy.Globals.categoryBreadCrum);

          }else{
            alert(L('unzipError'));
          }

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
  Ti.API.info('imagenes salvadas');
  Ti.API.info(e.imageNum);
  var imagesSaved = e.imageNum;
  if(imagesSaved==numImagesToSave){
    /*Traemos los datos de la categorias*/
    
  }
}
