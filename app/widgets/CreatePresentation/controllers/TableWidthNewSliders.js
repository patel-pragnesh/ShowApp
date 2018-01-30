/*Aqui se ejecuta el evento que agrega los Sliders Nuevos*/
var aDataSliders = [];
var colorText = "#"+Alloy.Globals.conf.text_form_color;
var colorSaveBtn = "#"+Alloy.Globals.conf.boton_save_color;
var folderMyPresentations = "my_presentations";


Ti.App.addEventListener("onSelctSliderToAddNew",onSelectedNewSlider);

function onSelectedNewSlider(e){
  var oDataSlider = e.oSlider;
  var idPresentation = e.idPresentation;
  var aDataPresentationParent = e.aDataPress;

  /*Leemos la carpeta del slider*/
  var presentationsFolder = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator +'presentations');
  var presentationIdFolder = Ti.Filesystem.getFile(presentationsFolder.resolve(), idPresentation);
  var appFolder = Ti.Filesystem.getFile(presentationIdFolder.resolve(), 'app');
  var sliders = Ti.Filesystem.getFile(appFolder.resolve(), 'sliders');
  var folderSlider = Ti.Filesystem.getFile(sliders.resolve(), oDataSlider.folder);
  var iconSlider = Ti.Filesystem.getFile(folderSlider.resolve(), "ico.jpg");

  /*Creasmos el View Contendeor*/
  var oViewForRow = Ti.UI.createView({
    left:Alloy.Globals.osUnits(5),
    width:Ti.UI.FILL,
    height:Ti.UI.FILL,
    backgroundColor:"transparent",
    layout:"horizontal"
  });

  /*Creamos la imagen del Slider*/
  var oImageSlider = Ti.UI.createImageView({
    image:iconSlider
  });
  oViewForRow.add(oImageSlider);


  /*Creamos el Label con el nombre del slider*/
  var oLabelName = Ti.UI.createLabel({
    left: Alloy.Globals.osUnits(5),
    width:Ti.UI.SIZE,
    height:Ti.UI.FILL,
    color:colorText,
    font:{
      fontFamily:"AvenirNextLTPro-Bold",
      fontSize:14
    },
    text: oDataSlider.name
  });
  oViewForRow.add(oLabelName);

  /*Agregamos el icono de delete*/



  /*Se crea el ViewRow*/
  var oViewRow = Ti.UI.createTableViewRow({
    width:Ti.UI.FILL,
    height:Ti.UI.FILL,
    editable:true
  });
  oViewRow.add(oViewForRow);

  var oPropertiesForRow = {
    aDataSlider:oDataSlider,
    idPresentationOfthisSlider:idPresentation,
    aDataPresentationParent:aDataPresentationParent
  }
  oViewRow.applyProperties(oPropertiesForRow);

  $.tableForNew.appendRow(oViewRow);

}
/*Creamos el boton para crear presentacion nueva*/
var oBtnCreatePresentation = Ti.UI.createButton({
  width:"90%",
  height:Alloy.Globals.osUnits(60),
  color:"#FFF",
  backgroundColor:colorSaveBtn,
  title:L('saveNewPresentation'),
  font:{
    fontFamily:"AvenirNextLTPro-Medium",
    fontSize:14
  }
});
oBtnCreatePresentation.addEventListener("click",onClickCreatePresentation);
$.contentBtnCreate.add(oBtnCreatePresentation);

function myTrim(x) {
    return x.replace(/^\s+|\s+$/gm,'');
}
function onClickCreatePresentation(e){
  var aDataForCreate = $.tableForNew.data[0].rows;
  var iTotalSliders = $.tableForNew.data[0].rows.length;
  Ti.API.info('TableData');
  Ti.API.info(JSON.stringify(aDataForCreate));

  /*Lo primero que hacemos el crear la estructura para esta nueva presentacion*/
  var titlePresentation = myTrim(Alloy.Globals.titleForNewPresentation);
  if(titlePresentation==""){
    alert(L('errorTitleNewPresentation'));
  }else{

    /*creamos el nombre del folder que lo contendra*/
    var nameFolderSection = titlePresentation.split(" ");
    var nameFolder = nameFolderSection[0]+"_"+Date().getTime();

    /*Creamos el Directorio basado en el nombre de la presentacion*/
    var dirMyPresentations = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator +'folderMyPresentations');
    var dirNewPresentation = Ti.Filesystem.getFile(dirMyPresentations.resolve(), nameFolder);
    if(!dirNewPresentation.exists()){
      dirNewPresentation.createDirectory();
    }
    /*Ahora creamos los directorios para la estructura de la presentacion*/
    /*Frameworks*/
    var dirFrameworks = Ti.Filesystem.getFile(dirNewPresentation.resolve(), "frameworks");
    dirFrameworks.createDirectory();
    /*shared*/
    var dirShared = Ti.Filesystem.getFile(dirNewPresentation.resolve(), "shared");
    dirShared.createDirectory();
    /*sliders*/
    var dirSliders = Ti.Filesystem.getFile(dirNewPresentation.resolve(), "sliders");
    dirSliders.createDirectory();

    /*Ahora movemos los sliders*/
    var aFolderSlidersForMove = [];
    for (var i = 0; i < iTotalSliders; i++) {
      var presentationsFolder = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator +'presentations');
      var presentationIdFolder = Ti.Filesystem.getFile(presentationsFolder.resolve(), aDataForCreate[i].aDataPresentationParent.idPresentationOfthisSlider);
      var appFolder = Ti.Filesystem.getFile(presentationIdFolder.resolve(), 'app');
      aFolderSlidersForMove[i] = Ti.Filesystem.getFile(Ti.appFolder + Ti.Filesystem.separator + aDataForCreate[i].aDataSlider.folder);
    }


  }

}
