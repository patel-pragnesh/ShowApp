var args = $.args || {};
var DataBaseQuery = require("DataBaseQuery");
var nameUser = new DataBaseQuery().getUserProperty("name");
var appellidoUser = new DataBaseQuery().getUserProperty("second_name");
var colorName = "#"+Alloy.Globals.conf.text_form_color;
var backColor = "#"+Alloy.Globals.conf.boton_back_color;


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

if(!args.isModal){
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
      Alloy.Globals.closeWindow($.headerRoot.parent.parent.parent);
      Alloy.Globals.categoryBreadCrum.pop();
    });
      $.headerRoot.add(btnClose);

  }else{
      Alloy.Globals.categoryBreadCrum = [];
  }
}else{
  /*Agregamos Boton de Cerrar*/
  var btnClose = Ti.UI.createButton({
    left:Alloy.Globals.osUnits(10),
    width:Alloy.Globals.osUnits(71),
    height:Alloy.Globals.osUnits(36),
    backgroundColor:backColor,
    borderRadius:5,
    color:"#FFF",
    title:"X",
    font:{
      fontFamily:"AvenirNextLTPro-Bold",
      fontSize:Alloy.Globals.osUnits(20),
    }
  });
  btnClose.addEventListener("click",function(){
    args.toClose.close();
  });
  $.headerRoot.add(btnClose);
}
