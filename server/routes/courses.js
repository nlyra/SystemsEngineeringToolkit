const Course = require('../models/course');
const VerifyToken = require('./auth').verifyToken;
const express = require('express');

const router = express.Router();

router.post('/course', VerifyToken, async (req, res) => {
  try {
    let course = {}
    course = await Course.findOne({ "_id": req.body.id }, '_id name description urlImage modules');
    res.json({ "course": course });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }


})
router.post('/info', VerifyToken, async (req, res) => {
  // console.log(req.body)
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
      // courses = await Course.find({}, '_id name description urlImage category', { limit: req.body.cardAmount }).skip(req.body.skip);
    } else {
      courses = await Course.find({}, '_id name description urlImage category', { limit: req.body.cardAmount }).skip(req.body.skip);
    }
    console.log(courses)

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
router.post('module/create', async (req, res) => {

  try {
    const module = new module({
      name: req.body.name,
      type: req.body.type,
      description: req.body.description,
      content: req.body.content
    })

    const savedModule = await module.save();

    console.log('added module ', savedModule._id);

    res.json(savedModule);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
})

module.exports = router;