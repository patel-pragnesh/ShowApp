function CreateDataBase(){
	try{
		var db = Ti.Database.open(Alloy.Globals.databaseName);
		//var sqlCreateTable = "CREATE TABLE IF NOT EXISTS usuarios (usuario_id INTEGER PRIMARY KEY AUTOINCREMENT, id_online INTEGER , name VARCHAR, email VARCHAR, image_company VARCHAR, company_name VARCHAR, url VARCHAR ,estatus INTEGER);";
		var sqlCreateTable = "CREATE TABLE IF NOT EXISTS usuarios (usuario_id INTEGER PRIMARY KEY AUTOINCREMENT, id_online INTEGER , name VARCHAR, second_name VARCHAR,email VARCHAR, estatus INTEGER);";
		db.execute(sqlCreateTable);

		var sqlToConfiguration = "CREATE TABLE IF NOT EXISTS configuration (id_configuration INTEGER PRIMARY KEY AUTOINCREMENT, company_name VARCHAR, background_color VARCHAR, background_color_left_bar VARCHAR,text_title_color VARCHAR, text_title_bold_color VARCHAR, text_user_color VARCHAR, text_form_color VARCHAR, text_category_color VARCHAR, text_principal_color VARCHAR, boton_back_color VARCHAR, boton_principla_color VARCHAR, boton_share_back_color VARCHAR, boton_delete_color VARCHAR, boton_save_color VARCHAR, image_url VARCHAR);";
		db.execute(sqlToConfiguration);

	}catch(e){
		alert("Error al crear la base de datos "+e);
	}finally{
		db.close();
		//Ti.API.info("Base de datos creada correctamente");
	}

	return true;
}
CreateDataBase.prototype.setUser = function(oDataUser){
	try {
		var db = Ti.Database.open(Alloy.Globals.databaseName);
		var sqlToSave = "INSERT INTO usuarios (id_online,name,second_name,email,estatus) VALUES(?,?,?,?,?);";
		db.execute(sqlToSave,oDataUser.id_online,oDataUser.name, oDataUser.second_name,oDataUser.email,1);
	} catch (e) {
		alert("Error al grabar usuario en Dispositivo: "+e);
	} finally {
		db.close();
		return true;
	}

}
CreateDataBase.prototype.setCompanyConf = function(oDataCompany){
	try {
		var db = Ti.Database.open(Alloy.Globals.databaseName);
		var sqlToSaveConf = "INSERT INTO configuration (company_name, background_color, background_color_left_bar,text_title_color, text_title_bold_color, text_user_color, text_form_color, text_category_color, text_principal_color, boton_back_color, boton_principla_color, boton_share_back_color, boton_delete_color, boton_save_color, image_url) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);";
		db.execute(sqlToSaveConf,oDataCompany.name, oDataCompany.background_color, oDataCompany.background_color_left_bar,oDataCompany.text_title_color, oDataCompany.text_title_bold_color, oDataCompany.text_user_color, oDataCompany.text_form_color, oDataCompany.text_category_color, oDataCompany.text_principal_color, oDataCompany.boton_back_color, oDataCompany.boton_principla_color, oDataCompany.boton_share_back_color, oDataCompany.boton_delete_color, oDataCompany.boton_save_color, oDataCompany.image_url);
	} catch (e) {
		alert("Error al salvar la configuracion en dispositivo: "+e);
	} finally {
		db.close();
		return true;
	}

}
CreateDataBase.prototype.getProperty = function(propiedad){
	try {
		var value = '';
		var db = Ti.Database.open(Alloy.Globals.databaseName);
		var sqlToProperti = "SELECT "+propiedad+" FROM configuration WHERE id_configuration = 1;";
		var rows = db.execute(sqlToProperti);
		while (rows.isValidRow()) {
			value = rows.fieldByName(propiedad);
			rows.next();
		}

	} catch (e) {
		alert("Error al traer propiedad de color o texto: "+e);
	} finally {
		db.close();
		return value;
	}
}
module.exports = CreateDataBase;
