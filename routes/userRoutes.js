const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const multerUpload = require('../utils/uploadFile')
const Token = require('../models/tokenModel');
const User = require('../models/userModel');

router.get('/', userController.getAllUsers)
router.route('/:id').get(authController.protect, userController.getUser).delete(authController.protect, userController.deleteUser);


// Route to handle photo upload
router.patch('/:id', authController.protect, multerUpload, (req, res, next) => {
    // The file path is available in the `req.file` object
    if (!req.file) {
    console.log('No file uploaded');
    next()
    } else {
        req.fileName = req.file.filename; // Store the filename for access in the next middleware
        next(); // Call next middleware or handler
    }
       
}, userController.updateUser); // Call the updateUser controller to handle the rest

router.get('/verfy-otp/:token', async(req, res) => {
    try {
        const token = await Token.findOne({token: req.params.token});
        if (!token) {
            return res.status(400).json({message: 'Invalid token'});
        }

        const user = await User.findById(token.userId);
        if (!user) {
            return res.status(400).json({message: 'User not found'});
        }
    
        await User.findOneAndUpdate({_id: user._id}, {Verified: true});
        await Token.findByIdAndDelete(token._id);
    
        return res.status(200).json({message: 'User verified successfully'});

    } catch (error) {
        console.log(error);
        return res.status(500).json({message: 'Something went wrong'});
    }

});

router.post('/register', authController.createUser);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

module.exports = router;
