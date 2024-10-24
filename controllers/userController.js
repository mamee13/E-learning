const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const path = require('path');

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();
    if (!users) {
        return next(new AppError('No users found in the database', 404));
    }

    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users
        }
    });
});

exports.getUser = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new AppError('No user found with that ID', 404));
    }
    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
});

exports.updateUser = catchAsync(async (req, res, next) => {
    // Check if a file was uploaded
    let updates = { ...req.body }; // Store the updates from req.body

    if (req.fileName) {
        // If there is a file, include the filename in the updates
        const photoPath = path.join('uploads', req.fileName);
        updates.photo = photoPath; // Assuming you want to save the photo's filename
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
        new: true,
        runValidators: true,
    });

    if (!user) {
        return next(new AppError('No user found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            user,
        },
    });
});


exports.deleteUser = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
        return next(new AppError('No user found with that ID', 404));
    }
    res.status(204).json({
        status: 'success',
        data: null
    });
});
