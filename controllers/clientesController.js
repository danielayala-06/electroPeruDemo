const db = require('../config/db')

exports.obtenerClientes = async (req, res) => {
    const SQL = 'SELECT id, nombre, apellido, dni, telefono, direccion, telefono, tienda FROM clientes'
    try {
        
        const [result] = await db.query(SQL)
        
        if(result.length == 0 ){
            return res.status(404).json({mensaje: 'No se encontro ningun registro'})
        }
        return res.status(200).json(result)

    } catch (e) {
        console.error(e)
    }

}

exports.createCliente = async (req, res) => {
    const {nombre, apellido, dni, telefono, direccion, tienda} = req.body
    //Preparamos la sentencia SQL
    const SQL = 'INSERT INTO clientes (nombre, apellido, direccion, tienda, telefono, dni) VALUES(?,?,?,?,?,?)'
    /** 
        Guardamos los datos en un array para validar la longitud de los datos en un ciclo foreach =>({}) 
    **/
    const datos = [
        {"campo": nombre, "maxLeng": 45, "minLeng":1},
        {"campo": apellido, "maxLeng": 45, "minLeng":1}, 
        {"campo":direccion, "maxLeng": 70, "minLeng":1},
        {"campo":tienda.toString(), "maxLeng": 70, "minLeng":1},
        {"campo": telefono, "maxLeng": 9, "minLeng":9}, 
        {"campo": dni, "maxLeng": 8, "minLeng":8}
    ]
    //Validacion para el dni y telefono
    datos.forEach(e => {
        if(campoExcedeLimite(e.campo, e.maxLeng, e.minLeng)){
            return res.status(400).json({error: `El campo: ${e.campo}. No cumple con los requisitos:(Caracteres Maximos:${e.maxLeng}, Minimos:${e.minLeng})`})
        }
    });

    try {
        const [result] = await db.query(SQL, [nombre, apellido, direccion, tienda, telefono, dni])
        //En caso de no haber filas afectadas(No se logro insertar el cliente). Se envia un mensaje de error
        if(result.affectedRows == 0){
            return res.status(500).json({error: 'No se logro registrar el cliente'})
        }
        return res.status(201).json({
            id: result.insertId,
            mensaje: 'Registrado correctamente'
        })
    } catch (e) {
        console.error(e); 
        //En caso de una violacion a las restricciones UNIQUE
        if (e.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'El DNI o teléfono ya se encuentra registrado' });
        }
        //En caso de insertar un dato que no exista en la FK
        if (e.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({ error: 'La tienda insertada no existe' });
        }
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}
/*
exports.editCliente = async (req, res) => {

    //Obtenemos el id del cliente a editar
    const {id} = req.params

    //Obtenemos los campos a editar
    const {nombre, apellido, dni, telefono, direccion, tienda} = req.body

}*/

function campoExcedeLimite(campo, maxLength, minLength) {

    if(typeof campo != 'string'){
        console.error('El primer parametro debe ser String')
        return true;
    }
    if(typeof maxLength != 'number' || isNaN(maxLength) || typeof minLength != 'number' || isNaN(minLength)){
        console.error('El segundo  y el tercer parametro debe ser un numero positivo')
        return true;
    }
    if(maxLength<minLength){
        console.error('El Segundo parametro debe ser mayor que el tercero');
        return true
    }

    try {
        return campo.length <= maxLength && campo.length >= minLength ? false:true    
    } catch (e) {
        console.error(e)
        return true
    }
}
