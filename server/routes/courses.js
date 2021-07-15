const Course = require('../models/course');
const User = require('../models/user');
const VerifyToken = require('./auth').verifyToken;
const GetRole = require('./auth').getRole;
const express = require('express');
const jwt_decode = require('jwt-decode');
const router = express.Router();
const fs = require('fs')
const config = require('../config.json');


router.post('/course', VerifyToken, GetRole, async (req, res) => {
  try {
    // get course info
    let course = {}

    if (req.body.roleID == 1) { // course for creator
      course = await Course.findOne({ "_id": req.body.id, "author": req.body.userID }, '_id name description urlImage categories modules author isEnabled skillLevel intendedAudience prerequisite');
      if (course == null || course == {}) // course for students (only enabled courses)
        course = await Course.findOne({ "_id": req.body.id, "isEnabled": true }, '_id name description urlImage modules author skillLevel intendedAudience prerequisite');
    } else
      course = await Course.findOne({ "_id": req.body.id, "isEnabled": true }, '_id name description urlImage modules author skillLevel intendedAudience prerequisite');
    // console.log(course)

    if (course != {} && course != null) {
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

      if (course.author === req.body.userID) {
        course.author = "yes"
      }



    if (req.body.newToken != undefined)
      res.json({ "course": course, "newToken": req.body.newToken });
    else if (course != {})
      res.json({ "course": course });
    } else
      res.json({ "message": "course not available" });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }

})

router.post('/course/update', VerifyToken, GetRole, async (req, res) => {
  try {
    if (req.body.roleID != 1) {
      res.json({ message: "unauthorized" })
      return
    }

    const update = await Course.updateOne(
      { _id: req.body.courseID }, 
      {
        $set: {
          name: req.body.name,
          description: req.body.description,
          skillLevel: req.body.skillLevel,
          categories: req.body.categories,
          intendedAudience: req.body.intendedAudience,
          prerequisite: req.body.prerequisite,
        }
      })

    // console.log('here')

    if (req.body.newToken != undefined)
      res.json({ 'status': 'course updated', "newToken": req.body.newToken });
    else
      res.json({ 'status': 'course updated' });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }

})

router.post('/course/updateImage', VerifyToken, GetRole, async (req, res) => {
  try {
    if (req.body.roleID != 1) {
      res.json({ message: "unauthorized" })
      return
    }

    const pathname = req.body.imageLink.split('/')
    const imageName = pathname[pathname.length - 1]

    const update = await Course.updateOne(
      { _id: req.body.courseID },
      {
        $set: {
          urlImage: config.server_url + '/' + req.body.courseID + '/' + imageName
        }
      })


    if (req.body.newToken != undefined)
      res.json({ 'status': 'success', "newToken": req.body.newToken })
    else
      res.json({ 'status': 'success' })

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
    let totalCourses = await Course.find({isEnabled: true}).countDocuments()

    if (req.body.search_query != undefined) {
      const query = req.body.search_query;
      courses = await Course.find({
        isEnabled: true,
        $or: [
          { "categories.label": { "$regex": query, $options: 'i' } },
          { "name": { "$regex": query, $options: 'i' } },
        ]
      }, '_id name description urlImage categories');

      if (req.body.newToken != undefined)
        res.json({ "status": "search", "courses": courses, "totalCourses": totalCourses, "newToken": req.body.newToken });
      else
        res.json({ "status": "search", "courses": courses, "totalCourses": totalCourses });
    } else {
      courses = await Course.find({isEnabled: true}, '_id name description urlImage categories', { limit: req.body.cardAmount }).skip(req.body.skip);

      if (req.body.newToken != undefined)
        res.json({ "status": "loading", "courses": courses, "totalCourses": totalCourses, "newToken": req.body.newToken });
      else
        res.json({ "status": "loading", "courses": courses, "totalCourses": totalCourses });
    }

  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }

})

router.post('/myCreatedCoursesInfo', VerifyToken, GetRole, async (req, res) => {

  try {
    if (req.body.roleID != 1) {
      res.json({ message: "unauthorized" })
      return
    }

    let courses = []
    const user = await User.findOne({ _id: req.body.userID })
    if (req.body.search_query != undefined) {
      const query = req.body.search_query;
      courses = await Course.find({
        $and: [
          { _id: user.createdCourses },
          { $or: [{ "categories.label": { "$regex": query, $options: 'i' } }, { "name": { "$regex": query, $options: 'i' } }] },
        ]
      }), '_id name description urlImage categories'
    }
    else {
      courses = await Course.find({ _id: user.createdCourses }, '_id name description urlImage categories')
    }

    if (req.body.newToken != undefined)
      res.json({ "courses": courses, "newToken": req.body.newToken });
    else
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
        isEnabled: true,
        $and: [
          { _id: user.enrolledClasses },
          { $or: [{ "categories.label": { "$regex": query, $options: 'i' } }, { "name": { "$regex": query, $options: 'i' } }] },
        ]
      }), '_id name description urlImage categories'
    }
    else {
      courses = await Course.find({ _id: user.enrolledClasses, isEnabled: true, }, '_id name description urlImage categories')
    }


    if (req.body.newToken != undefined)
      res.json({ "courses": courses, "newToken": req.body.newToken });
    else
      res.json({ "courses": courses });

  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }

})

router.post('/create', VerifyToken, GetRole, async (req, res) => {
  try {
    if (req.body.roleID != 1) {
      res.json({ message: "unauthorized" })
      return
    }

    const course = new Course({
      name: req.body.name,
      description: req.body.description,
      urlImage: req.body.urlImage,
      categories: req.body.categories,
      skillLevel: req.body.skillLevel,
      intendedAudience: req.body.intendedAudience,
      prerequisite: req.body.prerequisite,
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


    if (req.body.newToken != undefined)
      res.json({ savedCourse, "newToken": req.body.newToken });
    else
      res.json(savedCourse);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }

})

router.post('/removeEnrollment', VerifyToken, async (req, res) => {

  try {

    const find = await User.findOne({ _id: req.body.userID }, 'coursesData')

    delete find.coursesData[0][req.body.courseID]

    const update = await User.updateOne(
      { _id: req.body.userID },
      {
        $pull: { enrolledClasses: req.body.courseID },
        $set: { coursesData: find.coursesData }
      }
    )

    const updateCourse = await Course.updateOne(
      { _id: req.body.courseID },
      {
        $pull: { studentsEnrolled: req.body.userID },
        $inc: { currStudents: -1 }
      })

    if (req.body.newToken != undefined)
      res.json({ 'status': 'success', "newToken": req.body.newToken })
    else
      res.json({ 'status': 'success' })

  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }

})

// TODO: Need to move this to fileMulter once I figure out why it's not getting called when it sits in fileMulter
router.post('/removeFile', VerifyToken, GetRole, async (req, res) => {
  if (req.body.roleID != 1) {
    res.json({ message: "unauthorized" })
    return
  }


  try {

    course = await Course.findOne({ _id: req.body.courseID }, 'urlImage')

    if (course !== undefined) {
      const pathname = course.urlImage.split('/')
      const imageName = pathname[pathname.length - 1]

      // Special case for when first cover image change involves original PEO STRI logo
      if (pathname[pathname.length - 2] !== 'misc_files') {
        const path = 'public/' + req.body.courseID + '/' + imageName

        fs.unlinkSync(path)
      }

      if (req.body.newToken != undefined)
        res.json({ 'status': 'file removed', "newToken": req.body.newToken });
      else
        res.json({ 'status': 'file removed' });
    }

  } catch (err) {
    console.error(err)
    res.sendStatus(500);
  }

})

router.post('/deleteCreatedCourse', VerifyToken, GetRole, async (req, res) => {

  try {
    if (req.body.roleID != 1) {
      res.json({ message: "unauthorized" })
      return
    }

    const update = await User.updateOne(
      { _id: req.body.userID },
      { $pull: { createdCourses: req.body.courseID } }
    )

    const updateCourse = await Course.deleteOne({ _id: req.body.courseID })

    fs.rmdirSync('public/' + req.body.courseID, { recursive: true });


    if (req.body.newToken != undefined)
      res.sendStatus(400).json({ "newToken": req.body.newToken });
    else
      res.sendStatus(400);

  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
})

router.post('/module/create', VerifyToken, GetRole, async (req, res) => {
  if (req.body.roleID != 1) {
    res.json({ message: "unauthorized" })
    return
  }
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
    } else if (req.body.type === "Video") {
      const update = await Course.updateOne(
        { _id: req.body.courseID }, // query parameter
        {
          $push: {
            modules: {
              title: req.body.title,
              type: req.body.type,
              description: req.body.description,
              urlVideo: req.body.urlVideo,
            }
          }
        });
    } else if (req.body.type === "File") {
      const update = await Course.updateOne(
        { _id: req.body.courseID }, // query parameter
        {
          $push: {
            modules: {
              title: req.body.title,
              type: req.body.type,
              description: req.body.description,
              urlFile: req.body.urlFile,
            }
          }
        });
    } else if (req.body.type === "PDF") {
      const update = await Course.updateOne(
        { _id: req.body.courseID }, // query parameter
        {
          $push: {
            modules: {
              title: req.body.title,
              type: req.body.type,
              description: req.body.description,
              urlFile: req.body.urlFile,
            }
          }
        });
    } else if (req.body.type === "Text") {
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


    if (req.body.newToken != undefined)
      res.json({ 'status': 'module added', "newToken": req.body.newToken });
    else
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

            const updateUser = await User.updateOne(
              { _id: req.body.userID },
              {
               $push: { completedCourses: req.body.courseID }
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

    // If the user completed the first module, do the checks for enrollment. Otherwise, proceed as usual
    if (req.body.moduleID == 0) {

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
            $inc: { totalStudents: 1, currStudents: 1 }
          });

        const updateUser = await User.updateOne(
          { _id: req.body.userID },
          {
            $push: {
              enrolledClasses:
                req.body.courseID
            }

          });

      }


    }



    if (req.body.newToken != undefined)
      res.json({ 'status': 'grade saved', "newToken": req.body.newToken });
    else
      res.json({ 'status': 'grade saved' });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
})

router.post('/module/update', VerifyToken, GetRole, async (req, res) => {
  
  if (req.body.roleID != 1) {
    res.json({ message: "unauthorized" })
    return
  }

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
              gradeToPass: req.body.gradeToPass
            }
          }
        });
    } else if (req.body.type === "Video") {
      const update = await Course.updateOne(
        { _id: req.body.courseID }, // query parameter
        {
          $set: {
            [`modules.${req.body.moduleID}`]: {
              title: req.body.title,
              type: req.body.type,
              description: req.body.description,
              urlVideo: req.body.urlVideo,
            }
          }
        });
    } else if (req.body.type === "File") {
      const update = await Course.updateOne(
        { _id: req.body.courseID }, // query parameter
        {
          $set: {
            [`modules.${req.body.moduleID}`]: {
              title: req.body.title,
              type: req.body.type,
              description: req.body.description,
              urlFile: req.body.urlFile,
            }
          }
        });
    } else if (req.body.type === "PDF") {

      const update = await Course.updateOne(
        { _id: req.body.courseID }, // query parameter
        {
          $set: {
            [`modules.${req.body.moduleID}`]: {
              title: req.body.title,
              type: req.body.type,
              description: req.body.description,
              urlFile: req.body.urlFile,
            }
          }
        });
    } else if (req.body.type === "Text") {
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


    if (req.body.newToken != undefined)
      res.json({ 'status': 'module updated', "newToken": req.body.newToken });
    else
      res.json({ 'status': 'module updated' });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
})

router.post('/module/delete', VerifyToken, GetRole, async (req, res) => {

  try {
    if (req.body.roleID != 1) {
      res.json({ message: "unauthorized" })
      return
    }

    const update = await Course.updateOne(
      { _id: req.body.courseID },
      { $pull: { modules: { title: req.body.title, description: req.body.description } } }
    )


    if (req.body.newToken != undefined)
      res.json({ 'status': 'success', "newToken": req.body.newToken })
    else
      res.json({ 'status': 'success' })
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
})

router.post('/isenabled', VerifyToken, GetRole, async (req, res) => {

  try {
    if (req.body.roleID != 1) {
      res.json({ message: "unauthorized" })
      return
    }

    const update = await Course.updateOne(
      { _id: req.body.courseID },
      { $set: { isEnabled: req.body.isEnabled } }
    )

    res.json({ 'status': 'success' })
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
    if (req.body.moduleID == 0) {
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
            $inc: { totalStudents: 1, currStudents: 1 }
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

      const updateUser = await User.updateOne(
        { _id: req.body.userID },
        {
         $push: { completedCourses: req.body.courseID }
        });
    }


    if (req.body.newToken != undefined)
      res.json({ 'status': 'saved', "newToken": req.body.newToken });
    else
      res.json({ 'status': 'saved' });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
})

module.exports = router;