var CreateDataBase = require("CreateDataBase");
var backgroundColorBase =  "#"+new CreateDataBase().getProperty('background_color_left_bar');
var text_title_color = "#"+new CreateDataBase().getProperty('text_title_color');
var closeSessionColor = "#"+new CreateDataBase().getProperty('boton_back_color');

var imageLogo = new CreateDataBase().getProperty('image_url');
Ti.API.info('Image Logo'+imageLogo);

$.leftBar.backgroundColor = backgroundColorBase;
$.imageLogoCompany.image = imageLogo;
$.closeSession.backgroundColor = closeSessionColor;
$.closeSession.title = L('closeSession');

var aBotonForMenu = [];
aBotonForMenu[0] = {Btn:Ti.UI.createView({
                      width:Alloy.Globals.osUnits(123),
                      height:Alloy.Globals.osUnits(123),
                      backgroundColor:"#FFF",
                      borderRadius:Alloy.Globals.osUnits(10),
                  }),
                  Txt:Ti.UI.createLabel({
                    bottom:Alloy.Globals.osUnits(10),
                    text:L('perfilBtn'),
                    color:text_title_color,
                    font:{
                      fontFamily:"AvenirNextLTPro-Demi",
                      fontSize:Alloy.Globals.osUnits(12)
                    }
                  })
                };
aBotonForMenu[1] = {Btn:Ti.UI.createView({
                      top:Alloy.Globals.osUnits(15),
                      width:Alloy.Globals.osUnits(123),
                      height:Alloy.Globals.osUnits(123),
                      backgroundColor:"#FFF",
                      borderRadius:Alloy.Globals.osUnits(10),

                  }),
                  Txt:Ti.UI.createLabel({
                    bottom:Alloy.Globals.osUnits(10),
                    text:"Presentaciones",
                    color:text_title_color,
                    font:{
                      fontFamily:"AvenirNextLTPro-Demi",
                      fontSize:Alloy.Globals.osUnits(12)
                    }
                  })
                };
var iTotalBotonesMenu = aBotonForMenu.length;
for (var i = 0; i < iTotalBotonesMenu; i++) {
  aBotonForMenu[i].Btn.add(aBotonForMenu[i].Txt);
  $.menuContent.add(aBotonForMenu[i].Btn);
}
