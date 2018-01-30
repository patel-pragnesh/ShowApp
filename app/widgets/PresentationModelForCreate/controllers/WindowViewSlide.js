var args = $.args || {};
var dataSlider = args.dataSlider;
var idPresentation = args.idPress;


/*Agregamos el Header*/
$.canvasRoot.add(Alloy.createController("HeaderUser",{isModal:true,toClose:$.root}).getView());

/*Abrimos el archivo del slider*/
var presentationsFolder = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator +'presentations');
var presentationIdFolder = Ti.Filesystem.getFile(presentationsFolder.resolve(), idPresentation);
var appFolder = Ti.Filesystem.getFile(presentationIdFolder.resolve(), 'app');
var sliders = Ti.Filesystem.getFile(appFolder.resolve(), 'sliders');
var folderSlider = Ti.Filesystem.getFile(sliders.resolve(), dataSlider.folder);
var fileSlider = Ti.Filesystem.getFile(folderSlider.resolve(), dataSlider.folder+".html");

var oWebView = Ti.UI.createWebView({
  width:Ti.UI.FILL,
  height:Ti.UI.FILL,
});

if(OS_IOS){
  oWebView.url = fileSlider;
}else{
  oWebView.enableJavascriptInterface = true;
  oWebView.data = fileSlider.read();
}

$.canvasRoot.add(oWebView);
