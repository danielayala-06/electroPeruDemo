const express = require('express')
const router = express.Router()//Enrutador

//Accedemos al controlador
const tiendaController = require('../controllers/tiendaController')

//Definimos las rutas
//router.post('/', productoContoller.crearProducto);
router.get('/', tiendaController.obtenerTiendas);
//router.get('/:id', productoContoller.obtenerProductosPorId);
//router.put('/:id', productoContoller.actualizarProducto);
//router.delete('/:id', productoContoller.eliminarProducto);

module.exports = router 