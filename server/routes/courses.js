const Course = require('../models/course');
const User = require('../models/user');
const VerifyToken = require('./auth').verifyToken;
const express = require('express');
const jwt_decode = require('jwt-decode');
const router = express.Router();
const fs = require('fs')

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
    let data = await User.findOne({ "_id": req.body.userID }, 'coursesData')
    for (let i = 0; i < course.modules.length; i++) {
      if (data.coursesData[0] != undefined) {
        if (data.coursesData[0][req.body.id] != undefined) {
          if (data.coursesData[0][req.body.id][i] != undefined) {
            if (data.coursesData[0][req.body.id][i].status != undefined)
              course.modules[i]["completed"] = data.coursesData[0][req.body.id][i].status
            if (data.coursesData[0][req.body.id][i].score != undefined)
              course.modules[i]["grade"] = data.coursesData[0][req.body.id][i].score
          }
        }
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

// router.post('/course/enrollment', VerifyToken, async (req, res) => {

//   try {

//     // studentExists is a variable that will tell me if the course contains the user as an enrolled student
//     let studentExists = {}
//     studentExists = await Course.findOne({ "_id": req.body.courseID, "studentsEnrolled": req.body.userID }, '_id studentsEnrolled')

//     if (studentExists === null) {

//       const updateCourse = await Course.updateOne(
//         { _id: req.body.courseID },
//         {
//           $push: {
//             studentsEnrolled:
//               req.body.userID
//           },
//           $inc: { totalStudents: 1 }
//         });

//       const updateUser = await User.updateOne(
//         { _id: req.body.userID },
//         {
//           $push: {
//             enrolledClasses:
//               req.body.courseID
//           }

//         });

//       res.json({ 'status': 'student enrolled in course' });
//     }

//   } catch (e) {
//     console.log(e);
//     res.sendStatus(500);
//   }

// })

router.post('/info', VerifyToken, async (req, res) => {
  try {
    let courses = []

    if (req.body.search_query != undefined) {
      const query = req.body.search_query;
      courses = await Course.find({
        $or: [
          { "categories": { "$regex": query, $options: 'i' } },
          { "name": { "$regex": query, $options: 'i' } },
        ]
      }, '_id name description urlImage categories', { limit: req.body.cardAmount }).skip(req.body.skip);
    } else {
      courses = await Course.find({}, '_id name description urlImage categories', { limit: req.body.cardAmount }).sort({ totalStudents: -1 }).skip(req.body.skip);
    }

    res.json({ "courses": courses });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }

})

router.post('/myCreatedCoursesInfo', VerifyToken, async (req, res) => {
  try {

    let courses = []
    const user = await User.findOne({ _id: req.body.userID })
    if (req.body.search_query != undefined) {
      const query = req.body.search_query;
      courses = await Course.find({
        $and: [
          { _id: user.createdCourses },
          { $or: [{ "categories": { "$regex": query, $options: 'i' } }, { "name": { "$regex": query, $options: 'i' } }] },
        ]
      }), '_id name description urlImage categories'
    }
    else {
      courses = await Course.find({ _id: user.createdCourses }, '_id name description urlImage categories')
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
          { $or: [{ "categories": { "$regex": query, $options: 'i' } }, { "name": { "$regex": query, $options: 'i' } }] },
        ]
      }), '_id name description urlImage categories'
    }
    else {
      courses = await Course.find({ _id: user.enrolledClasses }, '_id name description urlImage categories')
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
      categories: req.body.categories,
      author: req.body.userID
    })

    const savedCourse = await course.save();

    findCourse = await Course.findOne({ "name": req.body.name, "description": req.body.description }, '_id')
    // console.log(findCourse._id)
    const updateUser = await User.updateOne(
      { _id: req.body.userID },
      {
        $push: {
          createdCourses:
            findCourse._id.toString()
        }
      });

    // console.log('added course ', savedCourse._id);

    res.json(savedCourse);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }

})

router.post('/removeEnrollment', VerifyToken, async (req, res) => {

  try {
    const update = await User.updateOne(
      { _id: req.body.userID },
      { $pull: { enrolledClasses: req.body.courseID } }
    )

    const updateCourse = await Course.updateOne(
      { _id: req.body.courseID },
      {
        $pull: { studentsEnrolled: req.body.userID },
        // $inc: { totalStudents: -1 }
      })

  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }

})

router.post('/deleteCreatedCourse', VerifyToken, async (req, res) => {

  try {

    // console.log(req.body.courseID)
    const update = await User.updateOne(
      { _id: req.body.userID },
      { $pull: { createdCourses: req.body.courseID } }
    )

    const updateCourse = await Course.deleteOne({ _id: req.body.courseID })

    fs.rmdirSync('public/' + req.body.courseID, { recursive: true });

  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
})

router.post('/module/create', VerifyToken, async (req, res) => {
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
              gradeToPass: req.body.gradeToPass
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

    res.json({ 'status': 'module added' });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
})

router.post('/module/score', VerifyToken, async (req, res) => {
  try {

    let modules = await Course.findOne({ _id: req.body.courseID }, 'modules');
    gradeToPass = modules.modules[req.body.moduleID].gradeToPass

    let courses = await User.findOne({ _id: req.body.userID }, 'coursesData');

    if (courses.coursesData[0] == undefined)
      courses.coursesData.append({})

    courses = courses.coursesData[0];
    if (courses === undefined)
      courses = {}

    if (courses[req.body.courseID] === undefined)
      courses[req.body.courseID] = {}

    if (courses[req.body.courseID][req.body.moduleID] === undefined)
      courses[req.body.courseID][req.body.moduleID] = {}

    courses[req.body.courseID][req.body.moduleID]["score"] = req.body.score

    if (gradeToPass <= req.body.score) {

      if (courses[req.body.courseID][req.body.moduleID]["status"] != 1) {
        if (modules.modules.length == req.body.moduleID + 1) {
          const updateCourse = await Course.updateOne(
            { _id: req.body.courseID },
            {
              $inc: { totalCompletedStudents: 1 }
            });
        }
        courses[req.body.courseID][req.body.moduleID]["status"] = 1
      }
    }

    const update = await User.updateOne(
      { _id: req.body.userID }, // query parameter
      {
        $set: {
          coursesData: courses
        }
      });


    res.json({ 'status': 'grade saved' });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
})

router.post('/module/update', VerifyToken, async (req, res) => {
  try {
    if (req.body.type === "Quiz") {
      const update = await Course.updateOne(
        { _id: req.body.courseID }, // query parameter
        {
          $set: {
            [`modules.${req.body.moduleID}`]: {
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
          $set: {
            [`modules.${req.body.moduleID}`]: {
              title: req.body.title,
              type: req.body.type,
              description: req.body.description,
            }
          },
        });
    }

    res.json({ 'status': 'module updated' });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
})


router.post('/module/completed', VerifyToken, async (req, res) => {
  try {
    let courses = await User.findOne({ _id: req.body.userID }, 'coursesData');

    courses = courses.coursesData[0];
    if (courses === undefined)
      courses = {}

    if (courses[req.body.courseID] !== undefined) { // exist course
      courses[req.body.courseID][req.body.moduleID] = { status: 1 }
    } else { // not course 
      courses[req.body.courseID] = {}
      courses[req.body.courseID][req.body.moduleID] = { status: 1 }
    }

    const update = await User.updateOne(
      { _id: req.body.userID }, // query parameter
      {
        $set: {
          coursesData: courses
        }
      });

      // If the user completed the first module, do the checks for enrollment. Otherwise, proceed as usual
      if(req.body.moduleID == 0)
      {
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

          // res.json({ 'status': 'student enrolled in course' });
        }
      }

    let modules = await Course.findOne({ _id: req.body.courseID }, 'modules');
    if (modules.modules.length == req.body.moduleID + 1) {
      const updateCourse = await Course.updateOne(
        { _id: req.body.courseID },
        {
          $inc: { totalCompletedStudents: 1 }
        });
    }

    res.json({ 'status': 'saved' });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
})

module.exports = router;