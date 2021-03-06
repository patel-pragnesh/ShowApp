function CreateDataBase(){
	try{
		var db = Ti.Database.open(Alloy.Globals.databaseName);

		db.execute("BEGIN");
		//var sqlCreateTable = "CREATE TABLE IF NOT EXISTS usuarios (usuario_id INTEGER PRIMARY KEY AUTOINCREMENT, id_online INTEGER , name VARCHAR, email VARCHAR, image_company VARCHAR, company_name VARCHAR, url VARCHAR ,estatus INTEGER);";
		var sqlCreateTable = "CREATE TABLE IF NOT EXISTS usuarios (usuario_id INTEGER PRIMARY KEY AUTOINCREMENT, id_online INTEGER, id_company INTEGER, id_user_type INTEGER,name INTEGER, user_type VARCHAR,second_name VARCHAR,email VARCHAR, estatus INTEGER);";
		db.execute(sqlCreateTable);

		/*Se crea la tabla de configuracion de colores*/
		var sqlToConfiguration = "CREATE TABLE IF NOT EXISTS configuration (id_configuration INTEGER PRIMARY KEY AUTOINCREMENT, company_name VARCHAR, background_color VARCHAR, background_color_left_bar VARCHAR,text_title_color VARCHAR, text_title_bold_color VARCHAR, text_user_color VARCHAR, text_form_color VARCHAR, text_category_color VARCHAR, text_principal_color VARCHAR, boton_back_color VARCHAR, boton_principla_color VARCHAR, boton_share_back_color VARCHAR, boton_delete_color VARCHAR, boton_save_color VARCHAR, image_url VARCHAR, title_categories VARCHAR, title_sub_categories VARCHAR);";
		db.execute(sqlToConfiguration);

		/*Creamos la tabla de Categorias locales*/
		var sqlToLocalCategory = 'CREATE TABLE IF NOT EXISTS categories (id_category_local INTEGER PRIMARY KEY AUTOINCREMENT, id_category_online INTEGER, category_type VARCHAR, name VARCHAR);';
		db.execute(sqlToLocalCategory);
		/*Indice para categoria unica*/
		var sqlINdexUniqueCAtegory = 'CREATE UNIQUE INDEX IF NOT EXISTS category_online_unique ON categories (id_category_online);';
		db.execute(sqlINdexUniqueCAtegory);

		/*creamos la tabla de relaciones de categorias (PIVOT)*/
		var sqlToRelationsCategoriesAndPresentatrions = "CREATE TABLE IF NOT EXISTS relations_cats (id_relation_local INTEGER PRIMARY KEY AUTOINCREMENT, id_relation_online INTEGER, id_category_parent INTEGER, id_category_child INTEGER);";
		db.execute(sqlToRelationsCategoriesAndPresentatrions);
		/*Indice para las relaciones de las categorias*/
		var sqlIndexRelationCats = 'CREATE UNIQUE INDEX IF NOT EXISTS relation_unique_cats ON relations_cats (id_category_parent, id_category_child);';
		db.execute(sqlIndexRelationCats);

		/*creamos la tabla de presentaciones*/
		var sqlToPresentations = 'CREATE TABLE IF NOT EXISTS presentations (id_presentation_local INTEGER PRIMARY KEY AUTOINCREMENT, id_presentation_online INTEGER, version VARCHAR, name VARCHAR, url_image_big VARCHAR, url_image_thum VARCHAR, url_package VARCHAR, description TEXT);';
		db.execute(sqlToPresentations);
		/*INDICE para Presentacion unica*/
		var sqlToRelationUniquePresentation = 'CREATE UNIQUE INDEX IF NOT EXISTS presetation_unique ON presentations (id_presentation_online);';

		/*Creamos la tabla de relacion de presentaciones con su categoria padre*/
		var sqlToRelationPresentationsCats = 'CREATE TABLE IF NOT EXISTS relations_cats_presentations (id_relacion_local_pres_cats INTEGER PRIMARY KEY AUTOINCREMENT, id_relacion_online INTEGER, id_category INTEGER, id_presentation INTEGER);';
		db.execute(sqlToRelationPresentationsCats);
		/*Indice para categoria y presentacion unica*/
		var sqlIndexRelationPresentationAndCat = 'CREATE UNIQUE INDEX IF NOT EXISTS relation_unique_pres_cat ON relations_cats_presentations (id_category, id_presentation);';
		db.execute(sqlIndexRelationPresentationAndCat);

		/*Tabla para las presentaciones locales, nombre y fecha*/
		var sqlForLocalPresentationsCreated = 'CREATE TABLE IF NOT EXISTS local_presentations (id_created_presentation INTEGER PRIMARY KEY AUTOINCREMENT, nombre VARCHAR, status INTEGER);';
		db.execute(sqlForLocalPresentationsCreated);

		/*Tabla para la relacion de presentaciones*/
		var sqlForSlidersCreatedPresentation = 'CREATE TABLE IF NOT EXISTS local_sliders (id_slider INTEGER PRIMARY KEY AUTOINCREMENT, id_created_presentation INTEGER, id_presentation_online INTEGER, name VARCHAR, folder_slider VARCHAR);';
		db.execute(sqlForSlidersCreatedPresentation);

		/*Tabla para la relacion de documentos agregados a una nueva presentacion*/
		var sqlForDocumentsInNewPressentation = 'CREATE TABLE IF NOT EXISTS local_documents (id_document INTEGER PRIMARY KEY AUTOINCREMENT, id_created_presentation INTEGER, id_presentation_online, INTEGER, name VARCHAR, mime_type VARCHAR, file VARCHAR);';
		db.execute(sqlForDocumentsInNewPressentation);

		/*Tabla para las estadisticas de descarga*/
		var sqlForDownloadstadistics = "CREATE TABLE IF NOT EXISTS estadisticas_descarga_presentations (id_estadistica_descarga INTEGER PRIMARY KEY AUTOINCREMENT, id_user INTEGER, id_presentation INTEGER, latitud VARCHAR, longitud VARCHAR, fecha_hora INTEGER);";
		db.execute(sqlForDownloadstadistics);

		/*Tabla para las estadisticas de View de Presentacion*/
		var sqlForViewstadistics = "CREATE TABLE IF NOT EXISTS estadisticas_presentation_views (id_estadistica_view INTEGER PRIMARY KEY AUTOINCREMENT, id_user INTEGER, id_presentation INTEGER, latitud VARCHAR, longitud VARCHAR, fecha_hora INTEGER);";
		db.execute(sqlForViewstadistics);

		/*Tabla para las estadisticas de tiempo en slider*/
		var sqlForStadisticasForTimeInSlider = "CREATE TABLE IF NOT EXISTS estadisticas_slider (id_estadistica_time_slider INTEGER PRIMARY KEY AUTOINCREMENT, id_user INTEGER, id_presentation INTEGER, slider_name VARCHAR, seconds_in_presentation INTEGER, latitud VARCHAR, longitud VARCHAR, fecha_hora INTEGER)";
		db.execute(sqlForStadisticasForTimeInSlider);

		db.execute("COMMIT");

	}catch(e){
		alert("Error al crear la base de datos "+e);
	}finally{
		db.close();
		Ti.API.info("Base de datos creada correctamente");
	}

	return true;
}

module.exports = CreateDataBase;
