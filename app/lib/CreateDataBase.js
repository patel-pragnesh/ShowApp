function CreateDataBase(){
	try{
		var db = Ti.Database.open(Alloy.Globals.databaseName);
		//var sqlCreateTable = "CREATE TABLE IF NOT EXISTS usuarios (usuario_id INTEGER PRIMARY KEY AUTOINCREMENT, id_online INTEGER , name VARCHAR, email VARCHAR, image_company VARCHAR, company_name VARCHAR, url VARCHAR ,estatus INTEGER);";
		var sqlCreateTable = "CREATE TABLE IF NOT EXISTS usuarios (usuario_id INTEGER PRIMARY KEY AUTOINCREMENT, id_online INTEGER , name VARCHAR, email VARCHAR, estatus INTEGER);";
		db.execute(sqlCreateTable);

		var sqlToConfiguration = "CREATE TABLE IF NOT EXISTS configuration (id_configuration INTEGER PRIMARY KEY AUTOINCREMENT, company_name VARCHAR, background_color VARCHAR, text_title_color VARCHAR, text_title_bold_color VARCHAR, text_user_color VARCHAR, text_form_color VARCHAR, text_category_color VARCHAR, text_principal_color VARCHAR, boton_back_color VARCHAR, boton_principla_color VARCHAR, boton_share_back_color VARCHAR, boton_delete_color VARCHAR, boton_save_color VARCHAR);";
		db.execute(sqlToConfiguration);

	}catch(e){
		alert("Error al crear la base de datos "+e);
	}finally{
		db.close();
		//Ti.API.info("Base de datos creada correctamente");
	}

	return true;
}
module.exports = CreateDataBase;
