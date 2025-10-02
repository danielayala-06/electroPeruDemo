// RUTAS = acceso a los recursos
//Verbos: 
//GET - OBTENER, PUT- ACTUALIZAR, POST- CREAR, DELETE- ELIMINAR

const express = require('express');
const router = express.Router() //Enrutador
//Acceso a la logica
const productoContoller = require('../controllers/productoController')

//Definimos las rutas
router.post('/', productoContoller.crearProducto);
router.get('/', productoContoller.obtenerProductos);
router.get('/:id', productoContoller.obtenerProductosPorId);
router.put('/:id', productoContoller.actualizarProducto);
router.delete('/:id', productoContoller.eliminarProducto);

module.exports = router 