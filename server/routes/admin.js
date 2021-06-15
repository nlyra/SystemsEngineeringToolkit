const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const router = express.Router();
const VerifyToken = require('./auth').verifyToken;

router.post('/users', VerifyToken, async (req, res) => {
  try {
    const users = await User.find({}, '_id first_name last_name email roleID');
    // console.log(users)
    res.json({ 'users': users });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

module.exports = router

