const Course = require('../models/course');
const VerifyToken = require('./auth').verifyToken;
const express = require('express');
const crypto = require('crypto');
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

router.post('/update', async (req, res) => {
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

  console.log(req.body)
  const moduleID = crypto.randomBytes(10).toString('hex')
  try {
    if (req.body.type === "Quiz") {
      const update = await Course.updateOne(
        { _id: req.body.courseID }, // query parameter
        {
          $push: {
            modules: {
              id: moduleID,
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
              id: moduleID,
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

router.post('/module/update', VerifyToken, async (req, res) => { })

module.exports = router;