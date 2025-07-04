const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')
const authMiddleware = require('../middlewares/auth.middleware')

router.get('/contacts', authMiddleware, userController.getContacts)
router.get('/messages/:contactId', authMiddleware, userController.getMessages)

router.post('/message', authMiddleware, userController.createMessage)
router.post('/message-read', authMiddleware, userController.messageRead)
router.post('/contact', authMiddleware, userController.createContact)
router.post('/reaction', authMiddleware, userController.createReaction)
router.post('/send-otp', authMiddleware, userController.sendOtp)

router.put('/profile', authMiddleware, userController.updateProfile)
router.put('/message/:messageId', authMiddleware, userController.updateMessage)
router.put('/email', authMiddleware, userController.updateEmail)

router.delete('/', authMiddleware, userController.deleteUser)
router.delete(
	'/message/:messageId',
	authMiddleware,
	userController.deleteMessage
)

module.exports = router
