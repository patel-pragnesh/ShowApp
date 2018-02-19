<?php
/**
 * ConexionBD
 *
 * Conexión BD para MySQL
 * Clase para Manejo de Bases de Datos MySQL desde PHP
 * @author Fernando Torres <ftorres@medialabs.com.mx>
 * @author Luis Ruben Perez Gil <luis.perez@torodigital.com.mx>
 * @author Raul Rodriguez <raul.rodriguez@torodigital.com.mx>
 * @version 4.0
 * @package DataBase
 * @copyright  Copyright (c) 2012, TORO
 */
 
class ConexionBD
{
	/**
    * Nombre del Host donde esta ubicada la Base de Datos
    * @var string
    */
	var $host;
	
	/**
    * Nombre del usuario con el que nos conectaremos a la Base de Datos
    * @var string
    */
	var $dataBaseUser;
	
	/**
    * Password del usuario con el que nos conectaremos a la Base de Datos
    * @var string
    */
	var $dataBasePassowrd;
	
	/**
    * Nombre de la Base de Datos a la cual nos conectaremos
    * @var string
    */
	var $dataBaseName;
	
	/**
    * Variable donde se almacenara la conexión al servidor MySQL
    * @var mixed devuelve un identificador de enlace a MySQL en caso de éxito o FALSE en caso de error. 
    */
	var $dataBaseConnection;
	
	/**
    * Cadena que almacena la consulta a realizar
    * @var string
    */
	var $sqlString;
	
	/**
    * Regresa el resultset de una sentencia SQL
    * @var object
    */
	var $doQueryS;
	
	/**
    * Activa o desactiva el Debug Query en caso de error
    * @var object
    */
	var $debugQuery = true;
	
	/**
    * Indica el número del indice del campo a consultar iniciando desde 0
    * @var integer
    */
	var $fieldArrayIndex;
	
	/**
    * Arreglo con los nombres de los campos devueltos
    * @var integer
    */
	var $fieldNamesArray = array();
	
	/**
    * Contiene una fila de resultado como un array asociativo, un array numérico o como ambos
    * @var mixed
    */
	var $setDataProvider;
	
	/**
    * Arreglo con los nombres de los campos devueltos
    * @var array
    */
	var $fieldName;	
	
	/**
    * Numero de campos de la tabla
    * @var integer
    */
	static $numFields;
	
	/**
    * Arreglo con los nombres de los campos devueltos
    * @var array
    */
	static $fieldNames;
	
	/**
    * Variable con el numero de campos de la consulta
    * @var object
    */
	static $fieldsNumber;
	
	/**
    * Variable con el numero del indice del campo a consultar iniciando desde 0
    * @var array
    */
	static $fieldArray = array();
	
	/**
    * Variable con el numero del ultimo registro insertado
    * @var array
    */
	static $lastInsertID;
	
	/**
    * Variable con el numero total de registros regresados en una consulta
    * @var array
    */
	static $rowsNumber; 
	
	/**
    * Variable con el numero de registros afectados en una consulta
    * @var array
    */
	static $affectedRow;
	
	/**
     * Constructor de la clase
     * @param string $host host del servidor de base de datos a conectarse
	 * @param string $dataBaseUser usuario para conexión con base de datos
	 * @param string $dataBasePassowrd contraseña para base de datos
	 * @param string $dataBaseName base de datos para conectar
	 * @param object $dataBaseConnection variable de conexión a la base de datos.
	 * @param array $connectionData variable con los datos de conexion
     */
	function __construct($connectionData)
	{
		$this->host = $connectionData["host"];
		$this->dataBaseUser = $connectionData["user"];
		$this->dataBasePassowrd = $connectionData["password"];
		$this->dataBaseName = $connectionData["database"];
		$this->dataBaseConnection = mysql_connect($this->host,$this->dataBaseUser,$this->dataBasePassowrd);	
		try
		{
			if($this->dataBaseConnection)
			{
				if(mysql_select_db($this->dataBaseName))
				{
					return true;
					mysql_query ("SET NAMES 'utf8'");
				}
				else
				{
					throw new Exception ("La base de datos seleccionada no existe",2);
				}
			}
			else
			{
				throw new Exception ("No se pudo conectar al servidor, revise datos de conexion",1);
			}		
		}
		catch (Exception $e)
		{
			echo "Error ".$e->getCode()." en la linea: ".$e->getLine().". ".$e->getMessage().".<br>";
		}
			
	}
	
	/**
	 * Función que ejecuta la sentencia SQL
	 * @param string $sqlString sentencia SQL a ejecutar
	 * @param object $doQueryS regresa el resultset de una sentencia SQL
	 * @var string|boolean $debugQuery activa o desactiva el query en caso de error
	 * @param string $sqlString sentencia SQL que pasa el usuario
	 * @return mixed
	 */	
	function doQuery($sqlString)
	{
		$this->sqlString = $sqlString;
		$this->doQueryS  = mysql_query($this->sqlString);
		try
		{
			if($this->doQueryS)
			{
				return true;
			}
			else
			{
				throw new Exception ('SQL query error: <span style="color:#FF0000">'.mysql_error()." </span>",3);
			}
			mysql_query ("SET NAMES 'utf8'");	
		}
		catch (Exception $e)
		{
			if($this->debugQuery)
			{
				echo "Error ".$e->getCode()." en la linea: ".$e->getLine().". ".$e->getMessage().".<br>Query: ".$this->sqlString;
			}
			error_log($e);
		}	
	}
	
	/**
	 * Funcion que nos dice el numero de Campos de la Tabla
	 * @staticvar integer $numFields numero de campos de la tabla
	 * @uses $doQueryS
	 * @return integer
	 */
	function getnumFields()
	{ 
		$numFields = mysql_num_fields($this->doQueryS);
		return $numFields;
	}
	
	/**
	 * Funcion que nos dice el nombre de un campo en especifico pasando un numero de campo como parametro
	 * @param string|integer $fieldArrayIndex número del indice del campo a consultar iniciando desde 0
	 * @param array $fieldNamesArray arreglo con los nombres de los campos devueltos
	 * @uses $doQueryS
	 * @return string
	 */
	function getNameField($fieldArrayIndex)
	{
		$this->fieldArrayIndex = $fieldArrayIndex;
		$this->fieldNamesArray[$this->fieldArrayIndex] = mysql_field_name($this->doQueryS,$this->fieldArrayIndex);
		return $this->fieldNamesArray[$this->fieldArrayIndex];
	}
	
	/**
	 * Funcion que nos dice el nombre de todos los campos separados por coma	
	 * @staticvar array $numFields arreglo con todos los campos de la tabla
	 * @staticvar string $fieldNames variable con el valor de los campos de la tabla separados por coma
	 * @uses $doQueryS
	 * @return string
	 */	 
	function getNameFieldsAll()
	{
		$numFields = mysql_num_fields($this->doQueryS);
		for($i=0; $i < $numFields; $i++)
		{
			$fieldNames .= $this->fieldNamesArray[$i] = mysql_field_name($this->doQueryS,$i).",";
		}
		return $fieldNames;
	}
	
	/**
	 * Función que regresa un arreglo con los nombres de los campos de una consulta
	 * @staticvar integer $fieldsNumber objeto con el numero de campos de la consulta
	 * @staticvar array $fieldArray arreglo con los nombres de los campos
	 * @uses $doQueryS
	 * @return array
	 */
	function getNameFieldsArray()
	{
		$fieldsNumber = mysql_num_fields($this->doQueryS);
		for($i = 0; $i < $fieldsNumber; $i++)
		{
			$fieldArray[$i] = mysql_field_name($this->doQueryS, $i);
		}
		return $fieldArray;
	}
	
	/**
	 * Funcion que nos Devuelve el identificador generado en la última llamada a INSERT
	 * @staticvar integer $lastInsertID el número del ultimo registro insertado
	 * @uses $dataBaseConnection
	 * @return integer|boolean
	 */
	function getInsertID()
	{
		 $lastInsertID = mysql_insert_id($this->dataBaseConnection);
		 return $lastInsertID;
	}

	/**
	 * Funcion que nos dice el numero de Registros que se afectaron en la consulta
	 * @staticvar integer $rowsNumber el número total de registros regresados en una consulta
	 * @return integer|boolean
	 */ 
	function getNumRows()
	{
		$rowsNumber = mysql_num_rows($this->doQueryS);
		return $rowsNumber;
	}
	
	/**
	 * Funcion que nos dice el numero de Registros que se afectaron en la consulta
	 * @staticvar integer $affectedRow variable con el numero de registros afectados en una consulta
	 * @uses $dataBaseConnection
	 * @return integer|boolean
	 */	
	function getAffectedRows()
	{
		 $affectedRow = mysql_affected_rows($this->dataBaseConnection);
		 return $affectedRow;
	}

	/**
	 * Funcion que retorna el dataprovider en un array
	 * @uses $doQueryS
	 * @return object|boolean
	 */	
	function setWhile()
	{
		$this->setDataProvider = mysql_fetch_array($this->doQueryS);
		return $this->setDataProvider;
	}	
	
	/**
	 * Funcion que devuelve los registros de un campo en especifico
	 * @param string $fieldName nombre del campo al que queremos acceder
	 * @uses $setDataProvider
	 * @return string
	 */	 
	function getDataSQL($fieldName)
	{
		$this->fieldName = $fieldName;
		return $this->setDataProvider[$this->fieldName];
	}
	
	/**
	 * Funcion que devuelve los registros de un campo en especifico
	 * @param string $fieldName nombre del campo al que queremos acceder
	 * @uses $setDataProvider
	 * @return string
	 */	 
	function getSQLConnection()
	{
		return $this->dataBaseConnection;
	}
	
	
	
	/**
	 * Funcion que libera la memoria
	 * @uses $doQueryS
	 */	
	function setFreeResult()
	{
		mysql_free_result($this->doQueryS);
	}
	
	/**
	 * Funcion que cierra la conexion con la BD
	 * @uses $dataBaseConnection
	 */
	function setClose()
	{
		mysql_close($this->dataBaseConnection);
	}	
}
?>