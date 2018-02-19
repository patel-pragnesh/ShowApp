function PresentationItemInCategory(aDataPress){
    this.aDataPress = aDataPress;
    // Ti.API.info('Datos en Item');
    // Ti.API.info(this.aDataPress);
}
PresentationItemInCategory.prototype.getItemForCategory = function(){
  var imageToShow;
  var thisClip = this;
  var colorName = Alloy.Globals.colorLuminosity("#"+Alloy.Globals.conf.text_title_color,0.5);
  var oItemCategory = Ti.UI.createView({
    top:Alloy.Globals.osUnits(15),
    left:Alloy.Globals.osUnits(15),
    width:Alloy.Globals.osUnits(250),
    height:Alloy.Globals.osUnits(130),
    backgroundColor:"transparent",
    layout:"vertical"
  });

  var oContentImage = Ti.UI.createView({
    width:Ti.UI.FILL,
    height:Alloy.Globals.osUnits(100),
    backgroundColor:"transparent",
  });
  oItemCategory.add(oContentImage);
  /*Si estamos offline leemos la imagen del dispositivo*/


    /* directorio de presentaciones en caso de que no exista*/
    var dirForPresentations = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'presentations');

    /*Directorio para la presentacion con su Id_online de prresentacion */
    var dirForPresentation = Ti.Filesystem.getFile(dirForPresentations.resolve(), thisClip.aDataPress.id_presentation);

    /* directorio para las imagenes de la presentacion*/
    var dirForImagesPresentation = Ti.Filesystem.getFile(dirForPresentation.resolve(), 'images_presentation');

    imageToShow = Ti.Filesystem.getFile(dirForImagesPresentation.resolve(), 'img_thum.jpg');
    if(imageToShow.exists()){
      imageToShow = imageToShow
    }else{
      imageToShow = thisClip.aDataPress.url_image_thum;
    }


  var imageItem = Ti.UI.createImageView({
    width:Ti.UI.FILL,
    height:Ti.UI.FILL,
    image:imageToShow,
    defaultImage:"/images/defaul_image_presentation_item.jpg"
  });
  oContentImage.add(imageItem);
  var oNameItem = Ti.UI.createLabel({
    top:Alloy.Globals.osUnits(5),
    left:Alloy.Globals.osUnits(5),
    text:thisClip.aDataPress.name,
    color:colorName,
    font:{
      fontFamily:"AvenirNextLTPro-Regular",
      fontSize:Alloy.Globals.osUnits(14)
    }
  });
  oItemCategory.add(oNameItem);

  oItemCategory.addEventListener("click",function (){
    thisClip.onClickItemPresentation();
  });

  return oItemCategory;
}
PresentationItemInCategory.prototype.onClickItemPresentation=function(e){
    var thisClip = this;
    //alert(thisClip.aDataPress.id_presentation);
    /*Creamos la Ventana para el detalle de la presentacion*/
    Alloy.createController("PresentationDetailWindow",{aDataPresentation:thisClip.aDataPress}).getView().open({modal:true});
}
module.exports = PresentationItemInCategory;
