var CreateDataBase = require("CreateDataBase");
function GetLogin(oDataLogin){
  var oGetLogin = Titanium.Network.createHTTPClient({timeuot:Alloy.Globals.timeOutWebServices});
  var url = Alloy.Globals.weburl+'api/v1/login';
  //Ti.API.info(url);
    oGetLogin.setRequestHeader("enctype", "multipart/form-data");
    oGetLogin.setRequestHeader("Content-Type:", "text/html; charset=utf-8");
    //oGetLogin.setRequestHeader("X-CSRF-Token", Alloy.Globals.CSRF);
  oGetLogin.open('POST',url);
  var varsTosend = {user:oDataLogin.user,
                    pass:oDataLogin.pass};
  oGetLogin.send(varsTosend);
  oGetLogin.onload = function(){
    var sData = this.responseText;
    var aData = JSON.parse(sData);
    Ti.API.info(aData);
    /*Grasbamos toda la informacion en la base de datos local*/
    if(aData.id){
      var oObjectSaveCompany = {
        name:aData.company.name,
        background_color: aData.company.company_conf.background_color,
        background_color_left_bar: aData.company.company_conf.background_color_left_bar,
        text_title_color: aData.company.company_conf.text_title_color,
        text_title_bold_color: aData.company.company_conf.text_title_bold_color,
        text_user_color: aData.company.company_conf.text_user_color,
        text_form_color: aData.company.company_conf.text_form_color,
        text_category_color: aData.company.company_conf.text_category_color,
        text_principal_color: aData.company.company_conf.text_principal_color,
        boton_back_color: aData.company.company_conf.boton_principal_color,
        boton_principla_color: aData.company.company_conf.boton_principal_color,
        boton_share_back_color: aData.company.company_conf.boton_share_back_color,
        boton_delete_color: aData.company.company_conf.boton_delete_color,
        boton_save_color: aData.company.company_conf.boton_save_color,
        image_url: aData.company.company_conf.logo_image_url
      }
      var oObjectToSaveUser = {
        id_online:aData.id,
        name:aData.name,
        second_name:aData.second_name,
        email:aData.email
      }
      /*El evento onLoadLogin se ejecuta en en controlador index.js*/
      new CreateDataBase().setCompanyConf(oObjectSaveCompany);
      new CreateDataBase().setUser(oObjectToSaveUser) ? Ti.App.fireEvent("onLoadLogin",{aDataUser:aData}) : alert("Error al grabar el usaurio+++");
    }else{
      Ti.App.fireEvent("onLoadLoginError",{aDataUser:false});
    }
    /*End GRABADO de DATOS*/

  }
  oGetLogin.onerror=function(){
    Ti.App.fireEvent("onLoadLoginError",{aDataUser:false});
  }
}
module.exports = GetLogin;
