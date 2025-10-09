const db = require("../config/db");

exports.obtenerClientes = async (req, res) => {
  const SQL =
    "SELECT id, nombre, apellido, dni, telefono, direccion, telefono, tienda FROM clientes";
  try {
    const [result] = await db.query(SQL);

    if (result.length == 0) {
      return res
        .status(404)
        .json({ mensaje: "No se encontro ningun registro" });
    }
    return res.status(200).json(result);
  } catch (e) {
    console.error(e);
  }
};

exports.obtenerClientesById = async (req, res)=>{
    const {id} = req.params
    const SQL = 'SELECT nombre, apellido, dni, telefono, direccion, tienda FROM clientes WHERE id = ?'
    
    try {
        const [result] = await db.query(SQL, [id])    
        if(!result.length){
            return res.status(404).json({mensaje: `No se encontro a un cliente con el id ${id}`})
        }

        return res.status(200).json(result)
    } catch (e) {
        console.error(e)
        return res.status(500).json({error: 'Error interno en el servidor'})
    }
    
}
exports.createCliente = async (req, res) => {
  const { nombre, apellido, dni, telefono, direccion, tienda } = req.body;
  //Preparamos la sentencia SQL
  const SQL =
    "INSERT INTO clientes (nombre, apellido, direccion, tienda, telefono, dni) VALUES(?,?,?,?,?,?)";
  /** 
        Guardamos los datos en un array para validar la longitud de los datos en un ciclo foreach =>({}) 
    **/
  const datos = [
    { campo: nombre, maxLeng: 45, minLeng: 3 },
    { campo: apellido, maxLeng: 45, minLeng: 3 },
    { campo: direccion, maxLeng: 70, minLeng: 1 },
    { campo: tienda, maxLeng: 70, minLeng: 1 },
    { campo: telefono, maxLeng: 9, minLeng: 9 },
    { campo: dni, maxLeng: 8, minLeng: 8 },
  ];
  //Validacion para el dni y telefono
  datos.forEach((e) => {
    if (campoExcedeLimite(e.campo, e.maxLeng, e.minLeng)) {
      return res
        .status(400)
        .json({
          error: `El campo: ${e.campo}. No cumple con los requisitos:(Caracteres Maximos:${e.maxLeng}, Minimos:${e.minLeng})`,
        });
    }
  });

  try {
    const [result] = await db.query(SQL, [
      nombre,
      apellido,
      direccion,
      tienda,
      telefono,
      dni,
    ]);
    //En caso de no haber filas afectadas(No se logro insertar el cliente). Se envia un mensaje de error
    if (result.affectedRows == 0) {
      return res
        .status(500)
        .json({ error: "No se logro registrar el cliente" });
    }
    return res.status(201).json({
      id: result.insertId,
      mensaje: "Registrado correctamente",
    });
  } catch (e) {
    console.error(e);
    //En caso de una violacion a las restricciones UNIQUE
    if (e.code === "ER_DUP_ENTRY") {
      return res
        .status(409)
        .json({ error: "El DNI o teléfono ya se encuentra registrado" });
    }
    //En caso de insertar un dato que no exista en la FK
    if (e.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({ error: "La tienda insertada no existe" });
    }
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

exports.editCliente = async (req, res) => {
  //Obtenemos el id del cliente a editar
  const { id } = req.params;

  //Obtenemos los valores encontrados en el body
  const { nombre, apellido, dni, telefono, direccion, tienda } = req.body;

  let sqlParts = []; //Arreglo que guardara parte de las consuta SQL
  let values = []; //Este arreglo guardara los nuevos valores

  //Validamos los datos obtenidos
  if (nombre && nombre != undefined && !campoExcedeLimite(nombre, 45, 3)) {
    sqlParts.push("nombre = ?");
    values.push(nombre);
  }
  if (
    apellido &&
    apellido != undefined &&
    !campoExcedeLimite(apellido, 45, 3)
  ) {
    sqlParts.push("apellido = ?");
    values.push(apellido);
  }
  if (
    direccion &&
    direccion != undefined &&
    !campoExcedeLimite(direccion, 70, 3)
  ) {
    sqlParts.push("direccion = ?");
    values.push(direccion);
  }
  if (dni && dni != undefined && !campoExcedeLimite(dni, 8, 8)) {
    sqlParts.push("dni = ?");
    values.push(dni);
  }
  if (telefono && telefono != undefined && !campoExcedeLimite(telefono, 9, 9)) {
    sqlParts.push("telefono = ?");
    values.push(telefono);
  }

  if (tienda && tienda != undefined && !campoExcedeLimite(tienda, 5, 1)) {
    sqlParts.push("tienda = ?");
    values.push(tienda);
  }

  if (sqlParts.length == 0) {
    return res.status(400).json({ mensaje: "No hay datos para actualizar" });
  }

  //Preparamos la consulta
  const sql = `UPDATE clientes SET ${sqlParts.join(", ")} WHERE id = ?`;
  values.push(id);

  try {
    const [result] = await db.query(sql, values);
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ mensaje: "No se se logro actualizar el cliente" });
    }
    res.status(200).json({ mensaje: "El cliente fue actualizado" });
  } catch (e) {
    console.error(500).json({ mensaje: "Error interno en el servidor" });
  }
};

exports.deleteCliente = async (req, res) => {
    const {id} = req.params
    const SQL = 'DELETE FROM clientes WHERE id = ?'

    try {
        const [result] = await db.query(SQL, [id])
        if(result.affectedRows === 0){
            return res.status(404).json({mesaje: 'No se encontro el registro'})
        }

        return res.status(200).json({mensaje: 'Se elimino el registro con exito'})
    } catch (e) {
        console.error(e)
    }
};

function campoExcedeLimite(campo, maxLength, minLength) {
  if (maxLength < minLength) {
    console.error("El Segundo parametro debe ser mayor que el tercero");
    return true;
  }
  try {
    return campo.toString().length <= maxLength &&
      campo.toString().length >= minLength
      ? false
      : true;
  } catch (e) {
    console.error(e);
    return true;
  }
}
