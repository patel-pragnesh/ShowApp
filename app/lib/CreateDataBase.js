function CreateDataBase(){
	try{
		var db = Ti.Database.open(Alloy.Globals.databaseName);
		//var sqlCreateTable = "CREATE TABLE IF NOT EXISTS usuarios (usuario_id INTEGER PRIMARY KEY AUTOINCREMENT, id_online INTEGER , name VARCHAR, email VARCHAR, image_company VARCHAR, company_name VARCHAR, url VARCHAR ,estatus INTEGER);";
		var sqlCreateTable = "CREATE TABLE IF NOT EXISTS usuarios (usuario_id INTEGER PRIMARY KEY AUTOINCREMENT, id_online INTEGER , name VARCHAR, email VARCHAR, image_company VARCHAR, company_name VARCHAR, estatus INTEGER);";

		db.execute(sqlCreateTable);

	}catch(e){
		alert("Error al crear la base de datos "+e);
	}finally{
		db.close();
		//Ti.API.info("Base de datos creada correctamente");
	}

	return true;
}
module.exports = CreateDataBase;
