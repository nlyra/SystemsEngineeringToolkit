const Course = require('../models/course');
const VerifyToken = require('./auth').verifyToken;
const express = require('express');

const router = express.Router();

router.post('/info', VerifyToken, async (req, res) => {
  try {
    let courses = []
    if (req.body.search_query != undefined) {
      const query = req.body.search_query.toLowerCase();
      courses = await Course.find({$or: [
        {"category": { "$regex": req.body.search_query }},
        {"name": { "$regex": req.body.search_query }},
      ]});
      // , '_id name description url', { limit: 10 }
      // console.log(courses)
    } else {
      courses = await Course.find({}, '_id name description url', { limit: 10 });
    }
    // console.log(courses)

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
      description: req.body.description
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