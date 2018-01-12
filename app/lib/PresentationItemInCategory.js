function PresentationItemInCategory(aDataPress){
    this.aDataPress = aDataPress;
    // Ti.API.info('Datos en Item');
    // Ti.API.info(this.aDataPress);
}
PresentationItemInCategory.prototype.getItemForCategory = function(){
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
  var imageItem = Ti.UI.createImageView({
    width:Ti.UI.FILL,
    height:Ti.UI.FILL,
    image:thisClip.aDataPress.url_image_thum,
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
