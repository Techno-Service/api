const auth = require('../middleware/auth')
const express = require('express')
const router = express.Router()
const stockController = require('../controllers/stock')

// Get
router.get('/' ,stockController.getAll)

// Get One
router.get('/:id' , auth('stock') ,stockController.getOne)

// Register
router.post('/', auth('stock') ,stockController.add)

// Stock Move
router.post('/:id/move', auth('stock') ,stockController.stockMove)

// Update
router.put('/:id' , auth('stock') ,stockController.update)

// Delete
router.delete('/:id' , auth('stock'),stockController.deleteStock)

module.exports = router 
