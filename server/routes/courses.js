const Course = require('../models/course');
const VerifyToken = require('./auth').verifyToken;
const express = require('express');

const router = express.Router();

router.post('/course', VerifyToken, async (req, res) => {
  try {
    let course = {}
    course = await Course.findOne({ "_id": req.body.id }, '_id name description urlImage');
    // console.log(course)
    res.json({ "course": course });
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
      }, '_id name description urlImage category', { limit: 15 }); // + .skip( req.body.skip )
      // , '_id name description url', { limit: 10 }
      // console.log(courses)
    } else {
      courses = await Course.find({}, '_id name description urlImage', { limit: 10 }).sort({ totalStudents: -1 });
    }
    // console.log(courses)

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
      url: req.body.url,
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

module.exports = router;