const Course = require('../models/course');
const User = require('../models/user');
const VerifyToken = require('./auth').verifyToken;
const express = require('express');
const jwt_decode = require('jwt-decode');
const router = express.Router();

router.post('/course', VerifyToken, async (req, res) => {
  try {
    let course = {}
    course = await Course.findOne({ "_id": req.body.id }, '_id name description urlImage modules');
    // "courseTitle" : course.name
    res.json({ "course": course });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }

})

router.post('/course/update', async (req, res) => {
  try {
    const update = await Course.updateOne(
      { _id: req.body.courseID }, // query parameter
      {
        $set: {
          name: req.body.name,
          description: req.body.description,
        }
      })

    res.json({ 'status': 'course added' });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }

})

router.post('/course/enrollment', VerifyToken, async (req, res) => {

  try {

    // studentExists is a variable that will tell me if the course contains the user as an enrolled student
    let studentExists = {}
    studentExists = await Course.findOne({ "_id": req.body.courseID, "studentsEnrolled": req.body.userID }, '_id studentsEnrolled')

    if (studentExists === null) {

      const updateCourse = await Course.updateOne(
        { _id: req.body.courseID },
        {
          $push: {
            studentsEnrolled:
              req.body.userID
          },
          $inc: { totalStudents: 1 }
        });

      const updateUser = await User.updateOne(
        { _id: req.body.userID },
        {
          $push: {
            enrolledClasses:
              req.body.courseID
          }

        });

      res.json({ 'status': 'student enrolled in course' });
    }

  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }

})

router.post('/info', VerifyToken, async (req, res) => {
  try {
    let courses = []

    if (req.body.search_query != undefined) {
      const query = req.body.search_query;
      courses = await Course.find({
        $or: [
          { "category": { "$regex": query, $options: 'i' } },
          { "name": { "$regex": query, $options: 'i' } },
        ]
      }, '_id name description urlImage category', { limit: req.body.cardAmount }).skip(req.body.skip);
    } else {
      courses = await Course.find({}, '_id name description urlImage category', { limit: req.body.cardAmount }).sort({ totalStudents: -1 }).skip(req.body.skip);
    }

    res.json({ "courses": courses });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }

})

router.post('/myCoursesInfo', VerifyToken, async (req, res) => {
  try {

    let courses = []
    const user = await User.findOne({ _id: req.body.userID })

    if (req.body.search_query != undefined) {
      const query = req.body.search_query;

      courses = await Course.find({
        $and: [
          { _id: user.enrolledClasses },
          { $or: [{ "category": { "$regex": query, $options: 'i' } }, { "name": { "$regex": query, $options: 'i' } }] },
        ]
      }), '_id name description urlImage category'
    }
    else {
      courses = await Course.find({ _id: user.enrolledClasses }, '_id name description urlImage category')
    }

    res.json({ "courses": courses });

  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }

})

router.post('/create', VerifyToken, async (req, res) => {
  try {
    const course = new Course({
      name: req.body.name,
      description: req.body.description,
      urlImage: req.body.urlImage,
      category: req.body.category,
      author: req.body.userID
    })

    const savedCourse = await course.save();

    console.log('added course ', savedCourse._id);

    res.json(savedCourse);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }

})

router.post('/removeCourse', VerifyToken, async (req, res) => {

  try {
    const update = await User.updateOne(
      { _id: req.body.userID },
      { $pull: { enrolledClasses: req.body.courseID } }
    )

    const updateCourse = await Course.updateOne(
      { _id: req.body.courseID },
      {
        $pull: { studentsEnrolled: req.body.userID },
        $inc: { totalStudents: -1 }
      })

  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }

})

router.post('/module/create', VerifyToken, async (req, res) => {
  console.log(req.body)
  try {
    if (req.body.type === "Quiz") {
      const update = await Course.updateOne(
        { _id: req.body.courseID }, // query parameter
        {
          $push: {
            modules: {
              title: req.body.title,
              type: req.body.type,
              description: req.body.description,
              quiz: req.body.quiz,
            }
          }
        });
    } else {
      const update = await Course.updateOne(
        { _id: req.body.courseID }, // query parameter
        {
          $push: {
            modules: {
              title: req.body.title,
              type: req.body.type,
              description: req.body.description,
            }
          }
        });
    }

    res.json({ 'status': 'course added' });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
})

module.exports = router;