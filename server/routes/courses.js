const Course = require('../models/course');
const User = require('../models/user');
const VerifyToken = require('./auth').verifyToken;
const express = require('express');
const jwt_decode = require('jwt-decode');
const router = express.Router();

router.post('/course', VerifyToken, async (req, res) => {
  try {

    // get course info
    let course = {}
    course = await Course.findOne({ "_id": req.body.id }, '_id name description urlImage modules');

    for (let i = 0; i < course.modules.length; i++) {
      if (course.modules[i].type == "Quiz") {
        for (let j = 0; j < course.modules[i].quiz.length; j++) {
          if (course.modules[i].quiz[j].type == "Multiple Choice") {
            course.modules[i].quiz[j].answers = course.modules[i].quiz[j].answers.sort(() => Math.random() - 0.5)
          }
        }

      }
    }

    // get user grades if any
    let grades = await User.findOne({ "_id": req.body.userID }, 'coursesQuizes')
    if (grades.coursesQuizes[0] != undefined) {
      grades = grades.coursesQuizes[0][req.body.id]
      let keys = Object.keys(grades)
      for (let i = 0; i < keys.length; i++) {
        course.modules[keys[i]]["grade"] = grades[keys[i]]
      }
    }



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
    studentExists = await Course.findOne({"_id": req.body.courseID, "studentsEnrolled": req.body.userID}, '_id studentsEnrolled')

    if(studentExists === null)
    {
  
      const updateCourse = await Course.updateOne(
        { _id: req.body.courseID }, 
        {
          $push: {
            studentsEnrolled:
              req.body.userID
          },
          $inc: {totalStudents : 1}
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

router.post('/removeCourse', VerifyToken, async (req, res) => {
 
  try {
    const update = await User.updateOne(
      {_id: req.body.userID},
      { $pull: {enrolledClasses: req.body.courseID}}
     )

  const updateCourse = await Course.updateOne(
    {_id: req.body.courseID},
    { 
      $pull: {studentsEnrolled: req.body.userID},
      $inc: {totalStudents : -1}
    })

  } catch(e) {
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

router.post('/module/score', VerifyToken, async (req, res) => {
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