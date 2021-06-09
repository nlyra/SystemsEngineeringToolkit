const Course = require('../models/course');
const User = require('../models/user');
const VerifyToken = require('./auth').verifyToken;
const express = require('express');

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

router.post('/create', async (req, res) => {

  try {
    const course = new Course({
      name: req.body.name,
      description: req.body.description,
      urlImage: req.body.urlImage,
      category: req.body.category
    })

    const savedCourse = await course.save();

    console.log('added course ', savedCourse._id);

    res.json(savedCourse);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }

})

// Needs to be fleshed out because it may not work right now. It is a reskin of createCourse POST
router.post('/module/create', VerifyToken, async (req, res) => {
  try {
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

    res.json({ 'status': 'course added' });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
})

router.post('/module/score', VerifyToken, async (req, res) => {
  // console.log(req.body)
  try {
    let courses = await User.findOne({ _id: req.body.userID }, 'coursesQuizes');
    courses = courses.coursesQuizes[0];
    if (courses === undefined)
      courses = {}

    if (courses[req.body.courseID] !== undefined) { // exist course
      courses[req.body.courseID][req.body.moduleID] = req.body.score
    } else { // not course 
      courses[req.body.courseID] = {}
      courses[req.body.courseID][req.body.moduleID] = req.body.score
    }

    // let courses = {}
    // courses[req.body.courseID] = {}
    // courses[req.body.courseID][req.body.moduleID] = req.body.score
    // console.log(req.body.UserID)


    const update = await User.updateOne(
      { _id: req.body.userID }, // query parameter
      {
        $set: {
          coursesQuizes: courses
        }
      });

    res.json({ 'status': 'course added' });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
})

module.exports = router;