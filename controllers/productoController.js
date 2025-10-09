//Acceso a la BD mysql/promise
const db = require('../config/db')

//Métodos exportados asyc porque la respuesta no es inmediata
//req = (solicitud)
//res = (respuesta)
exports.crearProducto = async (req, res) => {
    // 1.- Recepcionamos los datos
    const {descripcion, garantia, precio} = req.body //Opcion 1

    //Opcion 2
    /*    const descripcion = req.body.descripcion
        const garantia = req.body.garantia
        const precio = req.body.descripcion
    */
   
    //2. Validacion backend
   if(!descripcion || garantia === undefined || !precio){
        return res.status(400).json({mensaje:'falta completar los campos'})
   }
   //3. Estrucutrar la consulta... ? = comodin (tiene un índice, similar a un array)
   const sql = "INSERT INTO productos (descripcion, garantia, precio) VALUES(?,?,?)"

   //4. Transacción
    try {
        //5. Ejecutamos la consulta
        const [result] = await db.query(sql, [descripcion, garantia, precio])
        
        //6. Entregar un resultado (PK)
        res.status(201).json({
            id: result.insertId,
            mensaje: 'Registrado correctamente'
        })
    } catch (e) {
        console.error(e)
        res.status(500).json({mensaje:'Error interno del servidor'})
    }
    
}

exports.obtenerProductos = async (req, res) => {
    //1. Preparamos la consulta
    const sql = "SELECT id, descripcion, garantia, precio FROM productos"
    // 2. Transaccion 
    try{

       //3. Deserialización - PRIMER VALOR DEL ARREGLO
        const [productos] = await db.query(sql)
        
        //4. Enviamos la respuesta.
        res.status(200).json(productos)
    }catch(e){
        console.log(e)
        console.error(e)
        res.status(500).json({mensaje: 'Error interno del servidor'})
    }
}

//Buscar por ID
exports.obtenerProductosPorId = async (req, res) => {
    //params => http://miweb.com/api/modulo/{$params}
    const {id} = req.params
    //1. Preparamos la consulta
    const sql = "SELECT id, descripcion, garantia, precio FROM productos WHERE id = ?"
    
    // 2. Transaccion 
    try{
       //3. Deserialización - PRIMER VALOR DEL ARREGLO
        const [productos] = await db.query(sql, [id])
        //No encontramos el producto con el ID Enviado
        if(productos.length == 0 ){
            //Cuando se ejecuta "return" se FINALIZA el método
            return res.status(404).json({mensaje: 'No encontramos el producto'})
        }
        
        //4. Enviamos la respuesta.
        res.status(200).json({productos})

    }catch(e){
        console.log(e)
        console.error(e)
        res.status(500).json({mensaje: 'Error interno del servidor'})
    }
}

//Actualizar
exports.actualizarProducto = async(req, res) =>{
    //Necesitamos un parámetro
    const {id} = req.params

    //Leer un JSON body
    const {descripcion, garantia, precio} = req.body
    
    //Validación => Es obligatorio que al menos uno tenga datos
    if(!descripcion && garantia == undefined && !precio){
        return res.status(400).json({mensaje:'falta completar los campos'})
   }
   //Algoritmo eficiente de actualización
   //No se hará => UPDATE productos SET descripcion = ?, garantia = ?, precio = ? where id = ?
   //Se desarrollara => UPDATE productos SET precio = ? WHERE id = ?
   let sqlParts = [] //Campos que sufriarn actualización
   let values = []  //Valores para los campos

   if(descripcion){
    sqlParts.push('descripcion = ?')
    values.push(descripcion)
   }

   if(garantia != undefined){
    sqlParts.push('garantia = ?')
    values.push(garantia)
   }

   if(precio){
    sqlParts.push('precio = ?')
    values.push(precio)
   }

   if(sqlParts.length == 0){
    return res.status(400).json({mensaje: 'No hay datos por actualizar'})
   }

   //Construir de manera dinámica la consulta
   const sql = `UPDATE productos SET ${sqlParts.join(', ')} WHERE id = ?`
   values.push(id)

   try {
        const [result] = await db.query(sql, values)
        if(result.affectedRows === 0){
            return res.status(404).json({mensaje: 'No se ha encontramos el producto'})
        }
        res.status(200).json({mensaje: 'Se actualizo el producto correctamente'})
    } catch (e) {
        console.error(500).json({mensaje: 'Error interno en el servidor'})
   }
}

//Eliminar
exports.eliminarProducto = async (req, res) => {
    const {id} = req.params;
    //1. Preparamos la consulta
    const sql = "DELETE FROM productos WHERE id = ?"
    // 2. Transaccion 
     try{
       //3. Deserialización - PRIMER VALOR DEL ARREGLO
        const [result] = await db.query(sql, [id])
        //No encontramos el producto con el ID Enviado
        if(result.affectedRows === 0 ){
            return res.status(404).json({mensaje: 'No encontramos el producto'})
        }
        
        //4. Enviamos la respuesta.
        res.status(200).json({mensaje:'Producto eliminado'})

    }catch(e){
        console.error(e)
        res.status(500).json({mensaje: 'Error interno del servidor'})
    }
}