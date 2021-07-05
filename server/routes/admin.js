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

    const courses = await Course.find({}, '_id name totalStudents author totalCompletedStudents currStudents');
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
        // for some reason doesn't work for ids
        // { "_id": { "$regex": ObjectID(query), $options: 'i' } },
        { "first_name": { "$regex": query, $options: 'i' } },
        { "last_name": { "$regex": query, $options: 'i' } },
        { "email": { "$regex": query, $options: 'i' } },
      ]
    }, '_id first_name last_name email roleID');
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
        // for some reason doesn't work for ids
        // { "_id": { "$regex": ObjectID(query), $options: 'i' } },
        { "name": { "$regex": query, $options: 'i' } },
        { "author": { "$regex": query, $options: 'i' } },
      ]
    }, '_id name totalStudents author totalCompletedStudents currStudents');
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
        // for some reason doesn't work for ids
        // { "_id": { "$regex": ObjectID(query), $options: 'i' } },
        { "label": { "$regex": query, $options: 'i' } },
      ]
    });
    res.json({ 'categories': categories });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

module.exports = router

