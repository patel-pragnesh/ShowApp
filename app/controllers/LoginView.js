var GetLogin = require("GetLogin");
/**/
$.userName.addEventListener("return",onClickUserName);
function onClickUserName(e){
  $.userName.blur();
  $.userPass.focus();
}
/*Validamos el formulario de Login*/
$.userPass.addEventListener("return",onClickSend);
$.loginButton.addEventListener("click",onClickSend);
function onClickSend(e){
  var user = $.userName.value;
  var pass = $.userPass.value;
  if(user==="" || pass === ""){
    alert(L('loginError'));
  }else{
    /*Hacemos el envio de los datos de formulario de Login */
    var oDataToLogin = {
      user:$.userName.value,
      pass:$.userPass.value
    }
    new GetLogin(oDataToLogin);

  }
}
