const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.getAllUsers)
router.route('/:id').get(userController.getUser).delete(userController.deleteUser).patch(userController.updateUser);
router.post('/register', userController.createUser);
// router.post('/login', userController.login);

module.exports = router;
