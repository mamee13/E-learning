const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const Otp = require('../models/tokenModel');

const AppError = require('../utils/AppError');
const sendEmail  = require('../utils/sendEmail');
const crypto = require('crypto');

const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};


const createSendToken = (user, statusCode, req, res) => {
    const token = signToken(user._id);

    // res.cookie('jwt', token, {
    //   expires: new Date(
    //     Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    //   ),
    //   httpOnly: true,
    //   secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
    // });

    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
};

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); 
 };

exports.protect = catchAsync(async (req, res, next) => {
    // 1) Getting token and check of it's there
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    } //else if (req.cookies.jwt) {
    //     token = req.cookies.jwt;
    // }

    if (!token) {
        return next(
            new AppError('You are not logged in! Please log in to get access.', 401)
        );
    }

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(
            new AppError(
                'The user belonging to this token does no longer exist.',
                401
            )
        );
    }

    // 4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError('User recently changed password! Please log in again.', 401)
      );
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    res.locals.user = currentUser;
    next();
});

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError('You do not have permission to perform this action', 403)
            );
        }

        next();
    };
};

exports.createUser = catchAsync(async (req, res, next) => {
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        
    });

    const otpToken = crypto.randomBytes(16).toString('hex');

    const token = await Otp.create({
        userId: user._id,
        token: otpToken
    });
    const link = `https://127.0.0.1:3000/api/v1/users/verfy-otp/${token.token}`

    await sendEmail(user.email, link);

    createSendToken(user, 201, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
        return next(new AppError('Please provide email and password!', 400));
    }
    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');
    if(!user && !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    console.log(user);

    if(!user.verfied) {
        return next(new AppError('Please verify your email before login', 401));
    }
        
        // 3) If everything ok, send token to client
        createSendToken(user, 200, req, res);
});          

exports.logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
    });

    res.status(200).json({
        status: 'success',
        message: 'User logged out'
    });
};
