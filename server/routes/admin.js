const express = require('express');
const User = require('../models/user');
const Course = require('../models/course');
const Category = require('../models/categories');
const router = express.Router();
const VerifyToken = require('./auth').verifyToken;
const GetRole = require('./auth').getRole;
const fs = require('fs')

router.post('/users', VerifyToken, GetRole, async (req, res) => {
  try {
    if (req.body.roleID != 2) {
      res.json({ message: "unauthorized" })
      return
    }

    const users = await User.find({}, '_id first_name last_name email roleID');

    if (req.body.newToken != undefined)
      res.json({ 'users': users, "newToken": req.body.newToken });
    else
      res.json({ 'users': users });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.post('/courses', VerifyToken, GetRole, async (req, res) => {
  try {
    if (req.body.roleID != 2) {
      res.json({ message: "unauthorized" })
      return
    }

    const courses = await Course.find({}, '_id name totalStudents author totalCompletedStudents currStudents isEnabled');

    if (req.body.newToken != undefined)
      res.json({ 'courses': courses, "newToken": req.body.newToken });
    else
      res.json({ 'courses': courses });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.post('/categories', VerifyToken, GetRole, async (req, res) => {
  try {
    if (req.body.roleID != 2) {
      res.json({ message: "unauthorized" })
      return
    }

    const categories = await Category.find({});

    if (req.body.newToken != undefined)
      res.json({ 'categories': categories, "newToken": req.body.newToken });
    else
      res.json({ 'categories': categories });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.delete('/user', VerifyToken, GetRole, async (req, res) => {
  try {
    if (req.body.roleID != 2) {
      res.json({ message: "unauthorized" })
      return
    }
    const user = await User.deleteOne({ _id: req.body.deleteID })

    if (req.body.newToken != undefined)
      res.json({ 'status': "success", "newToken": req.body.newToken });
    else
      res.json({ 'status': "success" });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.post('/userRole', VerifyToken, GetRole, async (req, res) => {
  try {
    if (req.body.roleID != 2) {
      res.json({ message: "unauthorized" })
      return
    }

    const update = await User.updateOne({ _id: req.body.updateID },
      {
        $set: { roleID: req.body.updateValue }
      });

    if (req.body.newToken != undefined)
      res.json({ 'status': "success", "newToken": req.body.newToken });
    else
      res.json({ 'status': "success" });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.delete('/course', VerifyToken, GetRole, async (req, res) => {
  try {
    if (req.body.roleID != 2) {
      res.json({ message: "unauthorized" })
      return
    }

    const update = await User.updateOne(
      { _id: req.body.author },
      { $pull: { createdCourses: req.body.deleteID } }
    )

    const updateCourse = await Course.deleteOne({ _id: req.body.deleteID })

    fs.rmdirSync('public/' + req.body.deleteID, { recursive: true });


    if (req.body.newToken != undefined)
      res.json({ 'status': "success", "newToken": req.body.newToken });
    else
      res.json({ 'status': "success" });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
})

router.delete('/category', VerifyToken, GetRole, async (req, res) => {
  try {
    if (req.body.roleID != 2) {
      res.json({ message: "unauthorized" })
      return
    }

    const category = await Category.deleteOne({ _id: req.body.deleteID })

    if (req.body.newToken != undefined)
      res.json({ 'status': "success", "newToken": req.body.newToken });
    else
      res.json({ 'status': "success" });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.post('/users/search', VerifyToken, GetRole, async (req, res) => {
  try {
    if (req.body.roleID != 2) {
      res.json({ message: "unauthorized" })
      return
    }

    const query = req.body.query;
    const users = await User.find({
      $or: [
        { "first_name": { "$regex": query, $options: 'i' } },
        { "last_name": { "$regex": query, $options: 'i' } },
        { "email": { "$regex": query, $options: 'i' } },
      ]
    }, '_id first_name last_name email roleID');

    if (req.body.newToken != undefined)
      res.json({ 'users': users, "newToken": req.body.newToken });
    else
      res.json({ 'users': users });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.post('/courses/search', VerifyToken, GetRole, async (req, res) => {
  try {
    if (req.body.roleID != 2) {
      res.json({ message: "unauthorized" })
      return
    }

    const query = req.body.query;
    const courses = await Course.find({
      $or: [
        { "name": { "$regex": query, $options: 'i' } },
        { "author": { "$regex": query, $options: 'i' } },

      ]
    }, '_id name totalStudents author totalCompletedStudents currStudents isEnabled');

    if (req.body.newToken != undefined)
      res.json({ 'courses': courses, "newToken": req.body.newToken });
    else
      res.json({ 'courses': courses });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.post('/categories/search', VerifyToken, GetRole, async (req, res) => {
  try {
    if (req.body.roleID != 2) {
      res.json({ message: "unauthorized" })
      return
    }

    const query = req.body.query;
    const categories = await Category.find({
      $or: [
        { "label": { "$regex": query, $options: 'i' } },
      ]
    });

    if (req.body.newToken != undefined)
      res.json({ 'categories': categories, "newToken": req.body.newToken });
    else
      res.json({ 'categories': categories });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

module.exports = router

