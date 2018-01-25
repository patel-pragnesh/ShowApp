var args = $.args || {};
var aDataDocuments = args.documentsData;
var idPresentation = args.idPresentation;

Ti.API.info(aDataDocuments);

$.backTransparent.backgroundColor = "#"+Alloy.Globals.conf.boton_share_back_color;
$.titleList.color = "#"+Alloy.Globals.conf.boton_share_back_color;

/*Creamos la lista con los archivos disponibles*/
var iTotalFiles = aDataDocuments.length;
var itemForFile = [];
var fileNameItem = [];
var botonForOpenFile = [];
for (var i = 0; i < iTotalFiles; i++) {
  itemForFile[i] = Ti.UI.createView({
    top:Alloy.Globals.osUnits(5),
    width:Ti.UI.FILL,
    height:Alloy.Globals.osUnits(50),
    borderColor:"#848fab",
    borderWidth:Alloy.Globals.osUnits(0.5),
    layout:"horizontal"
  });

  fileNameItem[i] = Ti.UI.createLabel({
    width:Alloy.Globals.osUnits(400),
    top:Alloy.Globals.osUnits(15),
    left:Alloy.Globals.osUnits(10),
    text:aDataDocuments[i].name,
    color:Alloy.Globals.colorLuminosity(Alloy.Globals.conf.text_principal_color,-0.1),
    font:{
      fontFamily:"ProximaNova-Black",
      fontSize:16
    }
  });
  itemForFile[i].add(fileNameItem[i]);

  botonForOpenFile[i] = Ti.UI.createButton({
    top:Alloy.Globals.osUnits(7.5),
    width:Alloy.Globals.osUnits(45),
    height:Alloy.Globals.osUnits(35),
    backgroundColor:"#"+Alloy.Globals.conf.boton_share_back_color,
    title:L('viewPress'),
    color:"#FFF",
    font:{
      fontFamily:"ProximaNova-Regular",
      fontSize:14
    },
    borderRadius:5,
    filePath:aDataDocuments[i].file,
    mimeType: aDataDocuments[i].mime
  });
  botonForOpenFile[i].addEventListener("click",function(e){
    var fileName = e.source.filePath;
    var mime = e.source.mimeType;
    openFile(fileName,mime);
  });
  itemForFile[i].add(botonForOpenFile[i]);

  $.listDocuments.add(itemForFile[i]);
}



function openFile(fileName,mimeType){
  /*Leemos los Archivos para mostrarlos*/
  var presentationsFolder = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator +'presentations');
  var presentationIdFolder = Ti.Filesystem.getFile(presentationsFolder.resolve(), idPresentation);
  var appFolder = Ti.Filesystem.getFile(presentationIdFolder.resolve(), 'app');
  var sharedFolder = Ti.Filesystem.getFile(appFolder.resolve(), 'shared');
  var fileToOpen = Ti.Filesystem.getFile(sharedFolder.resolve(), fileName);
  if(OS_ANDROID){

    try{
    Ti.Android.currentActivity.startActivity(Ti.Android.createIntent({
        action: Ti.Android.ACTION_VIEW,
        type: mimeType,
        data: fileToOpen
    }));
    } catch(e) {
        Ti.API.info('error trying to launch activity, e = '+e);
        alert('No PDF apps installed!');
    }

  }else{
    var docViewer = Ti.UI.iOS.createDocumentViewer({url:fileToOpen});
    docViewer.show();
  }
}






/*Cerrar este Widget*/
$.closeBtn.addEventListener("click",onClickCloseBtn);
function onClickCloseBtn(e){
  var parent = $.canvasRoot.parent;
  parent.remove($.canvasRoot);
  $.canvasRoot = null;
}
