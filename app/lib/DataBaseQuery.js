function DataBaseQuery(){}

DataBaseQuery.prototype.setUser = function(oDataUser){
	try {
		var db = Ti.Database.open(Alloy.Globals.databaseName);
		var sqlToSave = "INSERT INTO usuarios (id_online,id_company,id_user_type,user_type,name,second_name,email,estatus) VALUES(?,?,?,?,?,?,?,?);";
		db.execute(sqlToSave,oDataUser.id_online,oDataUser.id_company,oDataUser.id_user_type,oDataUser.user_type,oDataUser.name, oDataUser.second_name,oDataUser.email,1);
	} catch (e) {
		alert("Error al grabar usuario en Dispositivo: "+e);
	} finally {
		db.close();
		return true;
	}

}
DataBaseQuery.prototype.setCompanyConf = function(oDataCompany){
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
DataBaseQuery.prototype.getProperty = function(propiedad){
	try {
		var value = '';
		var db = Ti.Database.open(Alloy.Globals.databaseName);
		var sqlToProperty = "SELECT "+propiedad+" FROM configuration WHERE id_configuration = 1;";
		var rows = db.execute(sqlToProperty);
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
DataBaseQuery.prototype.getAllProperties = function(propiedad){
	try {
		var value = {};
		var db = Ti.Database.open(Alloy.Globals.databaseName);
		var sqlToProperty = "SELECT * FROM configuration WHERE id_configuration = 1;";
		var rows = db.execute(sqlToProperty);
		while (rows.isValidRow()) {
			value.company_name = rows.fieldByName("company_name");
			value.background_color = rows.fieldByName("background_color");
			value.background_color_left_bar = rows.fieldByName("background_color_left_bar");
			value.text_title_color = rows.fieldByName("text_title_color");
			value.text_title_bold_color = rows.fieldByName("text_title_bold_color");
			value.text_user_color = rows.fieldByName("text_user_color");
			value.text_form_color = rows.fieldByName("text_form_color");
			value.text_category_color = rows.fieldByName("text_category_color");
			value.text_principal_color = rows.fieldByName("text_principal_color");
			value.boton_back_color = rows.fieldByName("boton_back_color");
			value.boton_principla_color = rows.fieldByName("boton_principla_color");
			value.boton_share_back_color = rows.fieldByName("boton_share_back_color");
			value.boton_delete_color = rows.fieldByName("boton_delete_color");
			value.boton_save_color = rows.fieldByName("boton_save_color");
			value.image_url = rows.fieldByName("image_url");
			rows.next();
		}

	} catch (e) {
		alert("Error al traer propiedad de color o texto: "+e);
	} finally {
		db.close();
		return value;
	}
}

DataBaseQuery.prototype.getUserProperty = function(propiedad){
	try {
		var value = '';
		var db = Ti.Database.open(Alloy.Globals.databaseName);
		var sqlToProperty = "SELECT "+propiedad+" FROM usuarios WHERE usuario_id = 1;";
		var rows = db.execute(sqlToProperty);
		while (rows.isValidRow()) {
			value = rows.fieldByName(propiedad);
			rows.next();
		}
	} catch (e) {
		alert("Error al obtener propiedad de usuario");
	} finally {
		db.close();
		return value;
	}
}

DataBaseQuery.prototype.getParentCategoriesOffline = function(oCategory){
	try {
		var aToReturn = [];

		var db = Ti.Database.open(Alloy.Globals.databaseName);
		var sqlTogetParentCats = "SELECT * FROM categories WHERE category_type = 'cat' ORDER BY id_category_online;";
		var rows = db.execute(sqlTogetParentCats);
		while (rows.isValidRow()) {
			aToReturn.push({get_category:{
													category_type: rows.fieldByName('category_type'),
													id_category: rows.fieldByName('id_category_online'),
													name: rows.fieldByName('name'),
											},
											id_category:rows.fieldByName('id_category_online'),
			});
			rows.next();
		}
	} catch (e) {
		Ti.API.info('No hay categorias' + e);
		//alert("Error al leer categorias principlaes: "+e);
		return [];
	} finally {
		db.close();
		return aToReturn;
	}
}
DataBaseQuery.prototype.setCategory = function(oCategory){
		try {
			var db = Ti.Database.open(Alloy.Globals.databaseName);
			var sqlToSaveCategory = "INSERT INTO categories (id_category_online, category_type, name) VALUES(?,?,?);";
			db.execute(sqlToSaveCategory, oCategory.id_category, oCategory.category_type, oCategory.category_name);
		} catch (e) {
			alert("Error al grabar categoria local:" + oCategory.category_name);
		} finally {
			Ti.API.info('Se grabo la category '+ oCategory.category_name);
			db.close();
			return true;
		}
}
DataBaseQuery.prototype.setRelationCategoryToCategory = function(id_parent,id_child){
	try {
		var db = Ti.Database.open(Alloy.Globals.databaseName);
		var sqlToRelation = "INSERT INTO relations_cats (id_category_parent, id_category_child) VALUES(?,?);";
		db.execute(sqlToRelation, id_parent, id_child);
	} catch (e) {
		alert("Error al grabar relacion categoria local: "+id_parent,', '+id_child);
	} finally {
		Ti.API.info('Se grabo la relacion: '+id_parent,', '+id_child);
		db.close();
		return true;
	}

}
DataBaseQuery.prototype.setPresentation = function(oPresentation){
	try {
		var db = Ti.Database.open(Alloy.Globals.databaseName);
		//id_presentation_online INTEGER, version VARCHAR, name VARCHAR, url_image_big VARCHAR, url_image_thum VARCHAR, url_package VARCHAR, description TEXT
		var sqlForPresetation = "INSERT INTO presentations (id_presentation_online, version, name, url_image_big, url_image_thum, url_package, description) VALUES(?,?,?,?,?,?,?);";
		db.execute(sqlForPresetation, oPresentation.id_presentation, oPresentation.version ,oPresentation.name, oPresentation.url_image_big, oPresentation.url_image_thum, oPresentation.url_package, oPresentation.description);
	} catch (e) {
		alert("Error al grabar PRESENTACION local: "+oPresentation.name+ ' ---- '+e);
	} finally {
		Ti.API.info('Se grabo la presentacion: '+oPresentation.name);
		db.close();
		return true;
	}
}

DataBaseQuery.prototype.setRelationCategoryToPresentation = function(id_category,id_presentaton){
	try {
		var db = Ti.Database.open(Alloy.Globals.databaseName);
		var sqlToRelation = "INSERT INTO relations_cats_presentations (id_category, id_presentaton) VALUES(?,?);";
		db.execute(sqlToRelation, id_category, id_presentaton);
	} catch (e) {
		alert("Error al grabar relacion categoria/presentacion local: "+id_category,', '+id_presentaton+'-----'+e);
	} finally {
		Ti.API.info('Se grabo la relacion: '+id_category,', '+id_presentaton);
		db.close();
		return true;
	}
}
module.exports = DataBaseQuery;
