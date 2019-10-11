const auth = require('../middleware/auth')
const express = require('express')
const router = express.Router()
const jobController = require('../controllers/job')

// Get
router.get('/' ,jobController.getAll)

// Get One
router.get('/:id' , auth() ,jobController.getOne)

// Register
router.post('/', auth() ,jobController.add)

// Update
router.put('/:id' , auth() ,jobController.update)

// Delete
router.delete('/:id' , auth(),jobController.deleteJob)

module.exports = router 
