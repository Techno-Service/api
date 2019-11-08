const auth = require('../middleware/auth')
const express = require('express')
const router = express.Router()
const moveController = require('../controllers/move')

// Get
router.get('/' ,moveController.getAll)

// Get One
router.get('/:id' , auth() ,moveController.getOne)

// Register
router.post('/', auth() ,moveController.add)

// Update
router.put('/:id' , auth() ,moveController.update)

// Delete
router.delete('/:id' , auth(),moveController.deleteMove)

module.exports = router 
