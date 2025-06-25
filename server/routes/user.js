const express = require('express')
const router = express.Router()

router.get('/contacts', (req, res) => {
	res.json({ contacts: [] })
})

module.exports = router
