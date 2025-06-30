const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')

router.get('/contacts', userController.getContacts)
router.get('/messages/:contactId', userController.getMessages)

router.post('/message', userController.createMessage)
router.post('/message-read', userController.messageRead)
router.post('/contact', userController.createContact)
router.post('/reaction', userController.createReaction)
router.post('/send-otp', userController.sendOtp)

router.put('/profile', userController.updateProfile)
router.put('/message/:messageId', userController.updateMessage)
router.put('/email', userController.updateEmail)

router.delete('/', userController.deleteUser)
router.delete('/message/:messageId', userController.deleteMessage)

module.exports = router
