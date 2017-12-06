function Checklogin(){

   var arruser= [];

   try{
		var db = Ti.Database.open(Alloy.Globals.databaseName);
		var sqlCreateTable = "SELECT * FROM usuarios WHERE 1;";
		var sqlusuarios = db.execute(sqlCreateTable);

	}catch(e){
		alert("Error: "+e);
	}finally{

		while (sqlusuarios.isValidRow())
		{
		  var userId = sqlusuarios.fieldByName('usuario_id');
		  var userIdOnline = sqlusuarios.fieldByName('id_online');
		  var userNombre = sqlusuarios.fieldByName('name');
      var companyName = sqlusuarios.fieldByName('company_name');


		  arruser.push({ usuario_id: userId , online_id:userIdOnline , nombre: userNombre});
		  sqlusuarios.next();
		}

		db.close();
	}



	return arruser;
}

module.exports= Checklogin;
