const auth = require('../middleware/auth')
const express = require('express')
const router = express.Router()
const stockController = require('../controllers/stock')

// Get
router.get('/' ,stockController.getAll)

// Get One
router.get('/:id' , auth() ,stockController.getOne)

// Register
router.post('/', auth() ,stockController.add)

// Update
router.put('/:id' , auth() ,stockController.update)

// Delete
router.delete('/:id' , auth(),stockController.deleteStock)

module.exports = router 
