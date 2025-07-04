const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')
const authMiddleware = require('../middlewares/auth.middleware')

router.get('/contacts', userController.getContacts)
router.get('/messages/:contactId', userController.getMessages)

router.post('/message', userController.createMessage)
router.post('/message-read', userController.messageRead)
router.post('/contact', userController.createContact)
router.post('/reaction', userController.createReaction)
router.post('/send-otp', authMiddleware, userController.sendOtp)

router.put('/profile', authMiddleware, userController.updateProfile)
router.put('/message/:messageId', userController.updateMessage)
router.put('/email', authMiddleware, userController.updateEmail)

router.delete('/', userController.deleteUser)
router.delete('/message/:messageId', userController.deleteMessage)

module.exports = router
