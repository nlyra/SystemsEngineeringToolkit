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

router.post('/course/enrollment', async (req, res) => {
  // console.log(req.body)
  try {

    let studentExists = {}
    studentExists = await Course.findOne( {"studentsEnrolled": req.body.userID} )

    console.log(studentExists)
    
    if(studentExists === null)
    {
      console.log(req.body.userID)

      const update = await Course.updateOne(
        { _id: req.body.courseID }, 
        {
          $push: {
            studentsEnrolled:
              req.body.userID
          }
        });

        // res.json({ 'status': 'student enrolled' });
    }

    let courseExists = {}
    courseExists = await User.findOne( {"enrolledClasses": req.body.courseID} )

    if(courseExists === null)
    {
      const update = await User.updateOne(
        { _id: req.body.userID }, 
        {
          $push: {
            enrolledClasses:
              req.body.courseID
          }
        });

        res.json({ 'status': 'enrolled in course' });
    }
    
    
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }

})

router.post('/info', VerifyToken, async (req, res) => {
  try {
    let courses = []
    //console.log(req.body.search_query)
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
    const user = await User.findOne({_id: req.body.userID})

    if (req.body.search_query != undefined) {
      const query = req.body.search_query;

      courses = await Course.find({
        $and: [
          {_id: user.enrolledClasses},
          {$or: [{ "category": { "$regex": query, $options: 'i' } }, { "name": { "$regex": query, $options: 'i' } }]},
      ]}), '_id name description urlImage category'}
      else {
      courses = await Course.find({_id: user.enrolledClasses}, '_id name description urlImage category')
    }

// 
    // // const temp = await Course.find({_id: user.enrolledClasses})

    // // if (req.body.search_query != undefined) {
    // //   const query = req.body.search_query;
    // //   courses = await temp.find({
    // //     $or: [
    // //       { "category": { "$regex": query, $options: 'i' } },
    // //       { "name": { "$regex": query, $options: 'i' } },
    // //     ]
    // //   });
    // // } else {
    // //   // courses = await Course.find({_id: user.enrolledClasses}, 'id');
    // // }
    
    // // const user = await User.findOne({_id: req.body.userID})
    // courses = await Course.find({_id: user.enrolledClasses})
    // console.log(user)
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

module.exports = router;