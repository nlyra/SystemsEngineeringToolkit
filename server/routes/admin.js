const express = require('express');
const User = require('../models/user');
const Course = require('../models/course');
const Category = require('../models/categories');
const router = express.Router();
const VerifyToken = require('./auth').verifyToken;
const fs = require('fs')

router.post('/users', VerifyToken, async (req, res) => {
  try {
    const users = await User.find({}, '_id first_name last_name email roleID');
    res.json({ 'users': users });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.post('/courses', VerifyToken, async (req, res) => {
  try {
    const courses = await Course.find({}, '_id name totalStudents author totalCompletedStudents currStudents');
    res.json({ 'courses': courses });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.post('/categories', VerifyToken, async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json({ 'categories': categories });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.delete('/user', VerifyToken, async (req, res) => {
  try {
    const user = await User.deleteOne({ _id: req.body.deleteID })
    res.json({ 'status': "success" });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.post('/userRole', VerifyToken, async (req, res) => {
  try {
    const update = await User.updateOne({ _id: req.body.updateID },
      {
        $set: { roleID: req.body.updateValue }
      });
      res.json({ 'status': "success" });
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  });
  
  router.delete('/course', VerifyToken, async (req, res) => {
    console.log(req.body)
    try {
      const update = await User.updateOne(
        { _id: req.body.author },
        { $pull: { createdCourses: req.body.deleteID } }
        )
        
        const updateCourse = await Course.deleteOne({ _id: req.body.deleteID })
        
        fs.rmdirSync('public/' + req.body.deleteID, { recursive: true });
        
      } catch (e) {
        console.log(e);
        res.sendStatus(500);
      }
    })
    
    router.delete('/category', VerifyToken, async (req, res) => {
      try {
        const category = await Category.deleteOne({ _id: req.body.deleteID })
        res.json({ 'status': "success" });
      } catch (e) {
        console.log(e);
        res.sendStatus(500);
      }
    });

    module.exports = router
    
    