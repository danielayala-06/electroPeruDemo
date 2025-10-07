const express = require('express');
const router = express.Router() //Enrutador

//
const clienteController = require('../controllers/clientesController')

router.get('/', clienteController.obtenerClientes); //
router.post('/', clienteController.createCliente); //
router.put('/:id', clienteController.editCliente); //

module.exports = router 