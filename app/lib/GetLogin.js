var DataBaseQuery = require("DataBaseQuery");
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
        id_user_type:aData.id_user_type,
        id_company:aData.id_company,
        user_type:aData.type_user.type,
        name:aData.name,
        second_name:aData.second_name,
        email:aData.email
      }
      Alloy.Globals.id_user_type = aData.id_user_type;
      Alloy.Globals.id_company = aData.id_company;
      /*El evento onLoadLogin se ejecuta en en controlador index.js*/
      new DataBaseQuery().setCompanyConf(oObjectSaveCompany);
      new DataBaseQuery().setUser(oObjectToSaveUser);
      /*Bajamos la imagen del Logo de la compañia y la guardamos en el dispositivo*/
      var oConnectionGetLogo = Ti.Network.createHTTPClient({timeout:Alloy.Globals.timeOutWebServices});
      oConnectionGetLogo.open("GET",oObjectSaveCompany.image_url);
      oConnectionGetLogo.send({});
      oConnectionGetLogo.onload = function(){
        var blobImage = this.responseData;
        /*Guardamos el Logo*/
        var oFolderLogo = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'company');
        if(!oFolderLogo.exists()){
          oFolderLogo.createDirectory();
        }
        var imageData = Ti.Filesystem.getFile(oFolderLogo.resolve(),'logo.jpg');
        imageData.write(blobImage);

        Ti.App.fireEvent("onLoadLogin",{aDataUser:aData})

      }

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
