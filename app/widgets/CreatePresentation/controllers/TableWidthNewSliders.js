/*Aqui se ejecuta el evento que agrega los Sliders Nuevos*/
var aDataSliders = [];
var colorText = "#"+Alloy.Globals.conf.text_form_color;
var colorSaveBtn = "#"+Alloy.Globals.conf.boton_save_color;
var folderMyPresentations = "my_presentations";
var DataBaseQuery = require("DataBaseQuery");
var itemsInTable = 0;

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

  var iTotalSliders = $.tableForNew.data.length;
   //Ti.API.info('TOTAL Sliders '+iTotalSliders);
  // Ti.API.info(JSON.stringify(aDataForCreate));
  if(iTotalSliders>0){

    var aDataForCreate = $.tableForNew.data[0].rows;
    iTotalSliders = aDataForCreate.length;
    /*Lo primero que hacemos el crear la estructura para esta nueva presentacion*/
    var titlePresentation = myTrim(Alloy.Globals.titleForNewPresentation);
    if(titlePresentation==""){
      alert(L('errorTitleNewPresentation'));
    }else{

      var idNewPresentation = new DataBaseQuery().setNewCreatePresentation(titlePresentation);
      Ti.API.info('ID new Press: '+idNewPresentation);

      /*Ahora movemos los sliders*/
      var aObjectToSliders = [];
      for (var i = 0; i < iTotalSliders; i++) {
          /*Creamos el Objeto para el la nueva presentacion*/
          aObjectToSliders[i] = {id_created_presentation:idNewPresentation,
                                id_presentation_online:aDataForCreate[i].idPresentationOfthisSlider,
                                folder_slider:aDataForCreate[i].aDataSlider.folder,
                                name:aDataForCreate[i].aDataSlider.name};

      }
      if(new DataBaseQuery().setNewSlidersByNewPresentationID(aObjectToSliders)){
        /*Aqui abrimos la nueva presentacion*/
        this.visible = false;
        /*Cerramos esta ventana*/
        $.contentTableAndBtnCreate.fireEvent("onCreateNewPresentation",{idNewPresentation:idNewPresentation});
      }


    }
  }else{

    alert("Error\n Debe de agregar almenos una slide");
  }


}
