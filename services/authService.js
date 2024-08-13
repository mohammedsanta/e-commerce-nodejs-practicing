const asyncHandler = require('express-async-handler');
const User = require("../models/userModel");
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const createToken = require("../utils/createToken");
const ApiError = require("../utils/apiError");
const sendEmail = require('../utils/sendEmail');

// @desc    Signup
// @route   GET /api/v1/auth/signup
// @access  Public
exports.signup = asyncHandler(async (req,res,next) => {

    const { name,email,password } = req.body;

    const user = await User.create({
        name,
        email,
        password,
    })

    const token = createToken(user._id)

    res.status(201).send({ data: user,token });

})

// @desc    Login
// @route   GET /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req,res,next) => {

    // 1) check if password and email in the body (validation)
    // 2) check if user exist & check if password is correct

    const user = await User.findOne({ email: req.body.email });

    if(!user || !bcrypt.compare(req.body.password,user.password)) {
        return next(new ApiError('Incorrect email or password',401));
    }

    // 3) genetate token
    const token = createToken(user._id);

    // Delete password from response
    delete user._doc.password

    res.status(200).json({ data: user, token })

})

// @desc make sure the user is logged in
exports.protect = asyncHandler(async (req,res,next) => {

    // check if token exists, if exists get
    let token;
    
    if(req.headers.authorization) {
        token = req.headers.authorization.split(' ')[1];
    }

    if(!token) {
        return next(new ApiError(
            'you are not login, please login to get access this route',
            401
        ))
    }

    // 2) verify token (no change happens, expire token)
    const decoded = jwt.verify(token,'SECRET_TOKEN');

    // 3) check if user exists
    const currentUser = User.findById(decoded._id);
    
    if(!currentUser) {
        return new ApiError(
            'The user that belong to this token does not longer exists',
            401
        )
    }

    // 4) check if user change password after token created
    
    if(currentUser.passwordChangedAt) {
        const passwordTimestamp = parseInt(
            currentUser.passwordChangedAt.getTime() / 1000,
            10
        )
        // password changed after token created (error)
        if(passwordTimestamp > decoded.iat) {
            return next(
                new ApiError(
                'User recently changed his password. please login again',
                401
                )
            )
        }
    }

    req.user = currentUser;
    next();
})

// @desc Authorization (User Premissions)
// ["admin", "manager"]
exports.allowTo = (...roles) =>
    asyncHandler(async (req,res,next) => {
        // 1) access role
        // 2) access registered user (req.user.role)
        if(!roles.includes(req.user.role)) {
            return next(
                new ApiError('You are not allowed to access this route',403)
            )
        }
        next();
    })


// @desc    Forgot password
// @route   POST /api/v1/auth/forgotPassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req,res,next) => {
    
    // 1) get user by email
    
    const user = await User.findOne({ email: req.body.email });
    if(!user) {
        return next(
            new ApiError(
                `there is no user with that email: ${req.body.email}`
            )
        )
    }

    // 2) if user exist, Generate hash reset random 6 digit and save it in db
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedResetCode = crypto
        .createHash('sha256')
        .update(resetCode)
        .digest('hex');

    // Save hashed password reset code into db
    user.passwordResetCode = hashedResetCode;
    // Add expiration time for password reset code (10 min)
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    user.passwordResetVerified = false;
    
    await user.save();

    console.log(user.hashedResetCode)

    // 3) Send the reset code via email
    const message = `Hi ${user.name},\n We received a request to reset the password on your E-shop Account. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The E-shop Team`;
    try {
        await sendEmail({
        email: user.email,
        subject: 'Your password reset code (valid for 10 min)',
        message,
        });
    } catch (err) {
        user.passwordResetCode = undefined;
        user.passwordResetExpires = undefined;
        user.passwordResetVerified = undefined;

        await user.save();
        return next(new ApiError('There is an error in sending email', 500));
    }

    // res
    //     .status(200)
    //     .json({ status: 'Success', message: 'Rest code sent to email' });
    res.redirect('/verifyRestCode')
})

exports.verifyPassRestCode = asyncHandler(async (req,res,next) => {

    // Get user based on reset code

    const hashedResetCode = crypto
        .createHash('sha256')
        .update(req.body.resetCode)
        .digest('hex');

    const user = await User.findOne({
        passwordResetCode: hashedResetCode,
        passwordResetExpires: { $gt: Date.now() }
    });
    
    if(!user) {
        return next(new ApiError('Reset code Invalid or expired'));
    }

    // 2) Reset code valid
    user.passwordResetVerified = true;
    user.save();

    // res.status(200).json({
    //     status: 'Success' 
    // });
    res.redirect('/resetpassword')
})

// @desc    Reset password
// @route   POST /api/v1/auth/resetPassword
// @access  Public
exports.resetPassword = asyncHandler(async (req,res,next) => {
    // 1) get user based on email
    const user = await User.findOne({ email: req.body.email });

    console.log(user)

    if(!user) {
        return next(
            new ApiError(`there is no user with email: ${req.body.email}`)
        )
    }
    // 2) check if reset code verified
    if(!user.passwordResetVerified) {
        return next(new ApiError('Rest code not verified',400))
    }

    user.password = req.body.newPassword;
    user.passwordResetCode = undefined;
    user.passwordResetExpire = undefined;
    user.passwordResetVerified = undefined;

    await user.save();

    // 3) if everything is ok, generate token
    const token = createToken(user._id);
    res.status(200).json({ token })
})