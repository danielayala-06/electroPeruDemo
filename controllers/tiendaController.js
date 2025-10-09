//Accedemos a la BD
const db = require('../config/db')

//Buscar tienda por ID
exports.serchById = async (req, res)=>{
    const {id} = req.params
    //SQL 
    const SQL = 'SELECT id, tienda FROM tiendas WHERE id = ?'
    
    if(id== undefined || id == null){
        return res.status(400).json({error: 'Ingrese un id valido'})
    }

    try {
        const [result] = await db.query(SQL, [id])
        
        if(result.length == 0){
            return res.status(404).json({error: 'No se encontro la tienda'})
        }

        return res.status(200).json(result)
    } catch (e) {
        console.error(e)
    }
}

//Listar tiendas
exports.obtenerTiendas = async (req, res)=>{
    //Preparamos el SQL
    const SQL = 'SELECT id, tienda FROM tiendas';

    try {
        const [tiendas] = await db.query(SQL);//Ejecutamos la consulta
        res.status(200).json(tiendas);//Enviamos la respuesta
    } catch (e) {
        console.error(e)
        res.status(500).json({error: 'Error en el servidor'})
    }
}

//Crear tienda
exports.createTienda = async (req, res) =>{
    //Obtenemos los datos en el body
    console.log('Soy los datos en el body')
    console.log(req.body)
    const {tienda} = req.body;

    console.log('Soy solo un dato')
    console.log(tienda)
    if(tienda==null){
        return res.status(400).json({error: 'No se aceptan valores vacios'})
    }
    
    //Preparamos la consulta SQL
    const SQL = 'INSERT INTO tiendas(tienda) VALUES (?)'

    try {
        const [result] = await db.query(SQL, [tienda])
        res.status(201).json({mensaje:`Se registro a: ${result.insertId}`})
    } catch (e) {
        console.error(e)
    }
}

//Editar tienda
exports.editTienda = async (req, res)=>{
    //Obtenemos los valores del body
    const {id} = req.params
    const {tienda} = req.body

    //Validaciones backend
    if(id == undefined){
        return res.status(400).json({error: 'Ingrese el id de la tienda en la url'})
    }
    console.log(id)
    console.log(tienda)

    //Preparamos la sentencia SQL
    const SQL = 'UPDATE tiendas SET tienda = ? WHERE id = ? '

    try {
        const [result] = await db.query(SQL, [tienda, id]) 
        if(result.affectedRows === 0 ){
            return res.status(404).json({error: 'Tienda no encontrada'})
        }

        return res.status(200).json({mensaje: 'Se actualizo el registro'})
    } catch (e) {
        console.error(e)
    }
}

//Eliminar tienda
exports.deleteTienda = async (req, res) =>{
    //Obtenemos el id ingresado en la ruta
    const {id} = req.params

    const SQL = 'DELETE FROM tiendas where id = ?'

    if(id == undefined){
        return res.status(400).json({error:'Ingrese el ID de la tienda que desea eliminar'})
    }

    try {
        const [result] = await db.query(SQL, [id])
        if(result.affectedRows == 0){
           return res.status(404).json({error: 'Tienda no encontrada'})
        }

        return res.status(200).json({mensaje:`Se elimino la tienda con id:${id}`})
        
    } catch (e) {
        console.error(e)
        res.status(500).json({error: 'Error del servidor'})
    }

}