function DataBaseQuery(){}

DataBaseQuery.prototype.setUser = function(oDataUser){
	try {
		var db = Ti.Database.open(Alloy.Globals.databaseName);
		var sqlToSave = "INSERT INTO usuarios (id_online,id_company,id_user_type,user_type,name,second_name,email,estatus) VALUES(?,?,?,?,?,?,?,?);";
		db.execute(sqlToSave,oDataUser.id_online,oDataUser.id_company,oDataUser.id_user_type,oDataUser.user_type,oDataUser.name, oDataUser.second_name,oDataUser.email,1);
		db.close();
	} catch (e) {
		alert("Error al grabar usuario en Dispositivo: "+e);
	} finally {

		return true;
	}

}
DataBaseQuery.prototype.setCompanyConf = function(oDataCompany){
	try {
		var db = Ti.Database.open(Alloy.Globals.databaseName);
		var sqlToSaveConf = "INSERT INTO configuration (company_name, background_color, background_color_left_bar,text_title_color, text_title_bold_color, text_user_color, text_form_color, text_category_color, text_principal_color, boton_back_color, boton_principla_color, boton_share_back_color, boton_delete_color, boton_save_color, image_url) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);";
		db.execute(sqlToSaveConf,oDataCompany.name, oDataCompany.background_color, oDataCompany.background_color_left_bar,oDataCompany.text_title_color, oDataCompany.text_title_bold_color, oDataCompany.text_user_color, oDataCompany.text_form_color, oDataCompany.text_category_color, oDataCompany.text_principal_color, oDataCompany.boton_back_color, oDataCompany.boton_principla_color, oDataCompany.boton_share_back_color, oDataCompany.boton_delete_color, oDataCompany.boton_save_color, oDataCompany.image_url);
		db.close();
	} catch (e) {
		alert("Error al salvar la configuracion en dispositivo: "+e);
	} finally {

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
		db.close();
	} catch (e) {
		alert("Error al traer propiedad de color o texto: "+e);
	} finally {

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
		db.close();
	} catch (e) {
		alert("Error al traer propiedad de color o texto: "+e);
	} finally {

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
		db.close();
	} catch (e) {
		alert("Error al obtener propiedad de usuario");
	} finally {

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
													name: rows.fieldByName('name')
											},
											id_category:rows.fieldByName('id_category_online')
			});
			rows.next();
		};
		db.close();
	} catch (e) {
		Ti.API.info('No hay categorias' + e);
		//alert("Error al leer categorias principlaes: "+e);
		return [];
	} finally {

		return aToReturn;
	}
}

DataBaseQuery.prototype.getSubCategoriesAndPresentationsByParentID = function(idParentCategory){
	try {
		var oJsonToReturn = {};
		var aSubCategories = [];
		var aPresentations = [];
		var haveDataPresentations = false;

		oJsonToReturn = {get_category:{sub_categories:[],presentations:[]}};

		/*Ahora traemos las SubCategorias de la categoria padre*/
		var dbSubCategories = Ti.Database.open(Alloy.Globals.databaseName);
		var sqlToGetSubCategories =  "SELECT t2.* FROM relations_cats AS t1 ";
				sqlToGetSubCategories += "INNER JOIN categories AS t2 ON t2.id_category_online = t1.id_category_child ";
				sqlToGetSubCategories += "WHERE t1.id_category_parent = "+idParentCategory+";";
		var rowsSubs = dbSubCategories.execute(sqlToGetSubCategories);
		while(rowsSubs.isValidRow()){
			aSubCategories.push({
				category_type: rowsSubs.fieldByName('category_type'),
				id_category: rowsSubs.fieldByName('id_category_online'),
				name: rowsSubs.fieldByName('name'),
			});
			rowsSubs.next();
		}
		dbSubCategories.close();

		/*Traigo las presentaciones de la categoria padre*/
		var dbPresentations = Ti.Database.open(Alloy.Globals.databaseName);
		var sqlToPresentations = "SELECT t2.* FROM relations_cats_presentations AS t1 ";
				sqlToPresentations += "INNER JOIN presentations AS t2 ON t2.id_presentation_online = t1.id_presentation ";
				sqlToPresentations += "WHERE t1.id_category = "+idParentCategory+";";
		var rowsPresentations = dbPresentations.execute(sqlToPresentations);
		while(rowsPresentations.isValidRow()){
			aPresentations.push({
					description: rowsPresentations.fieldByName('description'),
					id_presentation: rowsPresentations.fieldByName('id_presentation_online'),
					name: rowsPresentations.fieldByName('name'),
					version: rowsPresentations.fieldByName('version'),
					url_image_big: rowsPresentations.fieldByName('url_image_big'),
					url_image_thum: rowsPresentations.fieldByName('url_image_thum'),
					url_package: rowsPresentations.fieldByName('url_package'),
			});
			haveDataPresentations = true;
			rowsPresentations.next();
		}
		dbPresentations.close();

		/*Traemos los datos de la categoria Padre*/
		var dbCategoryParent = Ti.Database.open(Alloy.Globals.databaseName);
		var SqlCategoryParent = "SELECT * FROM categories WHERE id_category_online = "+idParentCategory+";";
		var rowCategory = dbCategoryParent.execute(SqlCategoryParent);
		while(rowCategory.isValidRow()){
			oJsonToReturn = {get_category:{
				category_type: rowCategory.fieldByName('category_type'),
				id_category: rowCategory.fieldByName('id_category_online'),
				name: rowCategory.fieldByName('name'),
				sub_categories: aSubCategories,
				presentations: aPresentations,
			},

			}
			rowCategory.next();
		}
		dbCategoryParent.close();





	} catch (e) {
		Ti.API.info('No hay Subs ' + e);
		//alert("Error al leer categorias principlaes: "+e);
		return [];
	} finally {



		return oJsonToReturn;

	}
}


DataBaseQuery.prototype.setCategory = function(oCategory){
		try {

			var dbCategory = Ti.Database.open(Alloy.Globals.databaseName);
			var sqlToSaveCategory = "INSERT INTO categories (id_category_online, category_type, name) VALUES(?,?,?);";
			dbCategory.execute(sqlToSaveCategory, oCategory.id_category, oCategory.category_type, oCategory.category_name);
			dbCategory.close();
		} catch (e) {
			//alert("Error al grabar categoria local:" + oCategory.category_name);
		} finally {
			Ti.API.info('Se grabo la category '+ oCategory.category_name);

			return true;
		}
}
DataBaseQuery.prototype.setRelationCategoryToCategory = function(id_parent,id_child){
	try {
		var dbRelationCategory = Ti.Database.open(Alloy.Globals.databaseName);
		var sqlToRelation = "INSERT INTO relations_cats (id_category_parent, id_category_child) VALUES(?,?);";
		dbRelationCategory.execute(sqlToRelation, id_parent, id_child);
		dbRelationCategory.close();
	} catch (e) {
		//alert("Error al grabar relacion categoria local: "+id_parent,', '+id_child);
	} finally {
		Ti.API.info('Se grabo la relacion: '+id_parent,', '+id_child);

		return true;
	}

}
DataBaseQuery.prototype.getPresentation = function(idPresentationOnline){
	var toReturn = {};
	try {
		var dbGetPresentation = Ti.Database.open(Alloy.Globals.databaseName);
		var sqlForGetPresentation = "SELECT * FROM presentations WHERE id_presentation_online = "+idPresentationOnline+";";
		var rowsPresentation = dbGetPresentation.execute(sqlForGetPresentation);
		while (rowsPresentation.isValidRow()) {
			toReturn = {
										idPresentation:rowsPresentation.fieldByName('id_presentation_online'),
										name:rowsPresentation.fieldByName('name'),
										version: rowsPresentation.fieldByName('version'),
								}
			rowsPresentation.next();
		}

		dbGetPresentation.close();
	} catch (e) {
		alert("Error al traer la presentación local");
	} finally {
		return toReturn;
	}
}
DataBaseQuery.prototype.setPresentation = function(oPresentation){
	try {
		var dbPresentation = Ti.Database.open(Alloy.Globals.databaseName);
		//id_presentation_online INTEGER, version VARCHAR, name VARCHAR, url_image_big VARCHAR, url_image_thum VARCHAR, url_package VARCHAR, description TEXT
		var sqlForPresetation = "INSERT INTO presentations (id_presentation_online, version, name, url_image_big, url_image_thum, url_package, description) VALUES(?,?,?,?,?,?,?);";
		// Ti.API.info('Sql Save Presentation');
		// Ti.API.info(sqlForPresetation);
		dbPresentation.execute(sqlForPresetation, oPresentation.id_presentation, oPresentation.version ,oPresentation.name, oPresentation.url_image_big, oPresentation.url_image_thum, oPresentation.url_package, oPresentation.description);
		// Ti.API.info('Object Data Save Presentation');
		// Ti.API.info(JSON.stringify(oPresentation));
		// Ti.API.info('Object Data -----------------------------');
		dbPresentation.close();
	} catch (e) {
		//alert("Error al grabar PRESENTACION local: "+oPresentation.name+ ' ---- '+e);
	} finally {
		Ti.API.info('Se grabo la presentacion: '+oPresentation.name);

		return true;
	}
}
DataBaseQuery.prototype.updateVersionPresentation = function(oPresentation){
		try {
			var dbForUpdatePresentation = Ti.Database.open(Alloy.Globals.databaseName);
			var sqlForUpdateVersion = "UPDATE presentations SET version = ? WHERE id_presentation_online = ?";
			dbForUpdatePresentation.execute(sqlForUpdateVersion, oPresentation.version,oPresentation.id_presentation);
			dbForUpdatePresentation.close();
		} catch (e) {
			Ti.API.info('Error al actualizar la presentacion: '+e);
		} finally {
			return true;
		}
}


DataBaseQuery.prototype.setRelationCategoryToPresentation = function(id_category,id_presentation){
	try {
		var dbRelation = Ti.Database.open(Alloy.Globals.databaseName);
		var sqlToRelation = "INSERT INTO relations_cats_presentations (id_category, id_presentation) VALUES(?,?);";
		Ti.API.info('Sql Save Presentation - Relation');
		Ti.API.info(sqlToRelation);
		dbRelation.execute(sqlToRelation, id_category, id_presentation);
		dbRelation.close();
	} catch (e) {
		//alert("Error al grabar relacion categoria/presentacion local: "+id_category,', '+id_presentation+'-----'+e);
	} finally {
		Ti.API.info('Se grabo la relacion: '+id_category,', '+id_presentation);

		return true;
	}
}
DataBaseQuery.prototype.deleteAllDataBase = function(){
		try {
			var aTablesName = [];
			aTablesName[0] = 'usuarios';
			aTablesName[1] = 'configuration';
			aTablesName[2] = 'categories';
			aTablesName[3] = 'relations_cats';
			aTablesName[4] = 'presentations';
			aTablesName[5] = 'relations_cats_presentations';

			var iTotalTables = aTablesName.length;

			var dbForDeletre = Ti.Database.open(Alloy.Globals.databaseName);

			dbForDeletre.execute("BEGIN");
			for (var i = 0; i < iTotalTables; i++) {
				var sqlForDelte = "DROP TABLE IF EXISTS "+aTablesName[i];
				dbForDeletre.execute(sqlForDelte);
			}
			dbForDeletre.execute("COMMIT");

			dbForDeletre.close();
		} catch (e) {
			alert("Error al borrar toda la base de datos");
		} finally {
			Ti.API.info('Base de datos borrada correctamente');
				return true;
		}
}
DataBaseQuery.prototype.getAllPresentations = function(){
	var aToReturnData = [];
	try {
		var dbForAllPresentations = Ti.Database.open(Alloy.Globals.databaseName);
		var sqlForAllPresentations = "SELECT * FROM presentations WHERE 1 ORDER BY name;";
		var rowsPresentations = dbForAllPresentations.execute(sqlForAllPresentations);
		while(rowsPresentations.isValidRow()){
			aToReturnData.push({idOnLine:rowsPresentations.fieldByName('id_presentation_online'),
													name:rowsPresentations.fieldByName('name')
													});
			rowsPresentations.next();
		}
	} catch (e) {
		alert("Error al leer las presentaciones locales");
	} finally {
		return aToReturnData;
	}
}
DataBaseQuery.prototype.setNewCreatePresentation = function(namePresentation){
	var idToReturn = 0;
	try {
		var dbForCreateNewPresentation = Ti.Database.open(Alloy.Globals.databaseName);
		var sqlForCreateNewPresentation = "INSERT INTO local_presentations (nombre, status) VALUES (?,?);";
		dbForCreateNewPresentation.execute(sqlForCreateNewPresentation,namePresentation,1);
		idToReturn = dbForCreateNewPresentation.getLastInsertRowId();
		dbForCreateNewPresentation.close();
	} catch (e) {
		alert("Error al grabar nueva presentacion creada "+e);
	} finally {
		return idToReturn;
	}
}
DataBaseQuery.prototype.setNewSlidersByNewPresentationID = function(oDataNewSlider){
	var iTotalSliders = oDataNewSlider.length;

	var idsSliders = [];
	// (id_slider INTEGER PRIMARY KEY AUTOINCREMENT, id_created_presentation INTEGER, id_presentation_online INTEGER, name VARCHAR,folder_slider VARCHAR)
	try {
		var dbForNewSlider = Ti.Database.open(Alloy.Globals.databaseName);
		dbForNewSlider.execute("BEGIN");
		for (var i = 0; i < iTotalSliders; i++) {
			var item = oDataNewSlider[i];
			dbForNewSlider.execute('INSERT INTO local_sliders (id_created_presentation, id_presentation_online, name, folder_slider) VALUES (?,?,?,?)', item.id_created_presentation, item.id_presentation_online, item.name, item.folder_slider);
			idsSliders.push(dbForNewSlider.getLastInsertRowId());
		}
		dbForNewSlider.execute("COMMIT");


		dbForNewSlider.close();
	} catch (e) {
		alert("Error al crear nuevo slider "+e);
	} finally {
		// Ti.API.info('IDS SLIDERS');
		// Ti.API.info(idsSliders);

		return true;
	}
}
DataBaseQuery.prototype.getLocalPresentationCreateForUserById = function(idPresentation){

	var aDataToReturn = {};
	var dataPresentation = {};
	var aDataSliders = [];
	try {
		var dbGetPresentation = Ti.Database.open(Alloy.Globals.databaseName);
		var sqlGetPresentation = 'SELECT * FROM local_presentations WHERE id_created_presentation = ? LIMIT 1';
		var rowPresentation = dbGetPresentation.execute(sqlGetPresentation,idPresentation);
		while (rowPresentation.isValidRow()) {
				dataPresentation = {
														name:rowPresentation.fieldByName("nombre"),
														id:rowPresentation.fieldByName("id_created_presentation")
													};
		rowPresentation.next();
		}
		aDataToReturn.Presentation = dataPresentation;

		/*Obtenemos los sliders*/
		//var dbGetSliders = Ti.Database.open(Alloy.Globals.databaseName);
		var sqlForSlider = 'SELECT * FROM local_sliders WHERE id_created_presentation = ?;';
		var rowsSliders = dbGetPresentation.execute(sqlForSlider,idPresentation);
		while (rowsSliders.isValidRow()) {
			aDataSliders.push({
					 								idPresentationOnline:rowsSliders.fieldByName("id_presentation_online"),
													name:rowsSliders.fieldByName("name"),
													folder_slider:rowsSliders.fieldByName("folder_slider")
												});
			rowsSliders.next();
		}
		aDataToReturn.Sliders = aDataSliders;
		//dbGetSliders.close();
		dbGetPresentation.close();

	} catch (e) {
			alert("Error al obtener presentation del usuario "+e);
	} finally {
		return aDataToReturn;
	}
}
DataBaseQuery.prototype.getAllLocalPresentationsCreatedByUser = function(){
	var aDataToReturn = [];
	try {
		var dbForAllLocalPresentations = Ti.Database.open(Alloy.Globals.databaseName);
		var sqlForAllLocalPresentationsByUser = 'SELECT * FROM local_presentations WHERE 1 ORDER BY id_created_presentation DESC;';
		var rowsAllPress = dbForAllLocalPresentations.execute(sqlForAllLocalPresentationsByUser);
		while (rowsAllPress.isValidRow()) {
			aDataToReturn.push({
														idPresentation:rowsAllPress.fieldByName("id_created_presentation"),
														name:rowsAllPress.fieldByName("nombre")
												});
			rowsAllPress.next();
		}
		dbForAllLocalPresentations.close();
	} catch (e) {
		alert("Error al leer todas las presentaciones creadas");
	} finally {
		return aDataToReturn;
	}

}
module.exports = DataBaseQuery;
