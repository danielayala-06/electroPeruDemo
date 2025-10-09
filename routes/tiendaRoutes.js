const express = require('express')
const router = express.Router()//Enrutador

//Accedemos al controlador
const tiendaController = require('../controllers/tiendaController')

//Definimos las rutas
router.get('/', tiendaController.obtenerTiendas);
router.post('/', tiendaController.createTienda);
router.put('/:id', tiendaController.editTienda);
router.get('/:id', tiendaController.serchById);
router.delete('/:id', tiendaController.deleteTienda);

module.exports = router 