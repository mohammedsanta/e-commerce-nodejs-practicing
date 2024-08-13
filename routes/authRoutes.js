const express = require('express');
const createToken = require('../utils/createToken');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { signup, login, forgotPassword, verifyPassRestCode, resetPassword } = require('../services/authService');
const router = express.Router();

router.post('/register', signup)
router.post('/login', login)
router.post('/forgotPassword',forgotPassword)
router.post('/verifyRestCode',verifyPassRestCode,(req,res) => {
    res.redirect('/resetPassword')
})
router.post('/resetPassword',resetPassword)

module.exports = router