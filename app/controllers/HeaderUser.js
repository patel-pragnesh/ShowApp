var CreateDataBase = require("CreateDataBase");
var nameUser = new CreateDataBase().getUserProperty("name");
var appellidoUser = new CreateDataBase().getUserProperty("second_name");
var colorName = "#"+new CreateDataBase().getProperty("text_form_color");
var backColor = "#"+new CreateDataBase().getProperty('boton_back_color');

var labelForName = Ti.UI.createLabel({
  right:Alloy.Globals.osUnits(10),
  text:nameUser+" "+appellidoUser,
  color:colorName,
  font:{
    fontFamily:"AvenirNextLTPro-Medium",
    fontSize:Alloy.Globals.osUnits(14)
  }
});
$.headerRoot.add(labelForName);

if(Alloy.Globals.countWindow!=0){
  /*Agregamos Boton de Cerrar*/
  var btnClose = Ti.UI.createButton({
    left:Alloy.Globals.osUnits(10),
    width:Alloy.Globals.osUnits(71),
    height:Alloy.Globals.osUnits(36),
    backgroundColor:backColor,
    borderRadius:5,
    color:"#FFF",
    title:"<",
    font:{
      fontFamily:"AvenirNextLTPro-Bold",
      fontSize:Alloy.Globals.osUnits(20),
    }
  });
  btnClose.addEventListener("click",function(){
    Alloy.Globals.closeWindow();
  });
  $.headerRoot.add(btnClose);
}
