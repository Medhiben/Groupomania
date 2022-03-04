//routeur 
const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user'); 
const auth = require('../middleware/auth');

/* -- users -- */
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/me', auth, userCtrl.getConnectedUser);
router.delete('/me', auth, userCtrl.deleteUser);

module.exports = router;