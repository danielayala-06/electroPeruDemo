//Accedemos a la BD
const db = require('../config/db')

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