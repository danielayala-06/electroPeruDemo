const express = require('express');
const router = express.Router() //Enrutador

//
const clienteController = require('../controllers/clientesController')

router.get('/', clienteController.obtenerClientes); //
router.get('/:id', clienteController.obtenerClientesById); //
router.post('/', clienteController.createCliente); //
router.put('/:id', clienteController.editCliente);
router.delete('/:id', clienteController.deleteCliente);

module.exports = router 