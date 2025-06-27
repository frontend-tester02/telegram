const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')

router.get('/messages/:contactId', userController.getMessages)
router.post('/create-message', userController.createMessage)

module.exports = router
