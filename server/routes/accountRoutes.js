const express = require('express')
const verifyToken = require('../middleware/verifyToken')
const router = express.Router()
const accountController = require('../controllers/accountController')


router.post('/register', accountController.registerAccount )
router.post('/login', accountController.loginAccount)
router.post('/logout', accountController.logoutAccount)
router.post('/refresh', accountController.refreshAccount)
router.get('/profile', verifyToken, accountController.getSpecificAccount)
router.put('/profile', verifyToken, accountController.updateAccount)
router.delete('/profile', verifyToken, accountController.deleteAccount)


module.exports = router;