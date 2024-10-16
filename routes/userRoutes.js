const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/', authController.getAllUsers)
router.route('/:id').get(authController.protect, authController.getUser).delete(authController.protect, authController.deleteUser).patch(authController.protect, authController.updateUser);
router.post('/register', authController.createUser);
router.post('/login', authController.login);

module.exports = router;
