const Course = require('../models/course');
const User = require('../models/user');
const VerifyToken = require('./auth').verifyToken;
const express = require('express');
const jwt_decode = require('jwt-decode');
const router = express.Router();
const fs = require('fs')

router.post('/userInfo', VerifyToken, async (req, res) => {
    try {
        
        // console.log(req.body)
      let user = {}
      user = await User.findOne({ _id: req.body.userID }, ' first_name last_name email completedCourses enrolledClasses createdCourses roleID');
      
      if(user.roleID === 2)
      {
        numUsers = await User.find().countDocuments()
        numCourses = await Course.find().countDocuments()
        
        res.json({"user": user, "numUsers": numUsers, "numCourses": numCourses})
      }
      else
        res.json({ "user": user });

    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  
  })

  module.exports = router;