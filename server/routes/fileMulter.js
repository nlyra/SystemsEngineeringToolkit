const multer = require('multer');
const express = require('express');
const VerifyToken = require('./auth').verifyToken;
const GetRole = require('./auth').getRole;
const config = require('../config.json');
const Course = require('../models/course');
const fs = require("fs");
const mkdirp = require('mkdirp')

const router = express.Router();

//handle upload files
const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
});
const upload = multer({ storage: fileStorageEngine })

router.post('/single', VerifyToken, GetRole, upload.single('file'), async (req, res) => {
  // req.body.roleID is undefined in the scope of this function, so we must use the query data
  if (req.query.roleID != 1 && req.query.roleID != 2) {
    res.json({ message: "unauthorized" })
    return
  }

  try {

    // validating image types in case someone attempts to access route without using frontend
    let validImageTypes = ["PNG", "JPEG", "GIF", "TIF", "RAW", "JPG"]

    // Checking to see if the extension is one of the valid types
    const imageTypePath = req.query.imageName.split('.')
    const imageType = imageTypePath[imageTypePath.length - 1]
    const validInput = validImageTypes.includes(imageType.toUpperCase());

    // If it isn't, return and allow user to input valid image
    if (!validInput) {
      res.json({ 'status': 'Incorrect upload type' })
    }

    // Grabbing the actual filename minus its extension so that we can validate alphanumeric inputs
    var val = imageTypePath[imageTypePath.length - 2];
    var RegEx = /[^0-9a-z]/i;
    var isValid = !(RegEx.test(val));

    // If the value does contain invalid symbols (non-alphanumeric), tell user the input is invalid
    if (isValid === false) {
      res.json({ 'status': 'not alphanumeric' })
    }

    const currPath = __dirname + "/../public/" + req.query.imageName
    const newPath = __dirname + "/../public/" + req.query.courseID + "/" + req.query.imageName

    const made = mkdirp.sync(__dirname + "/../public/" + req.query.courseID)

    fs.rename(currPath, newPath, function (err) {
      if (err) {
        throw err
      } else {
        console.log(`Successfully moved the file ${req.query.imageName}!`);
      }
    });

    const update = await Course.updateOne(
      { _id: req.query.courseID },
      { $set: { "urlImage": "/" + req.query.courseID + "/" + req.query.imageName } }
    )

    res.send({ "status": "Success" })
  }
  catch (e) {
    console.log(e);
  }

})

router.post('/singleModuleFile', VerifyToken, upload.single('file'), async (req, res) => {

  // splitting file name so we can validate the input
  const fileTypePath = req.query.imageName.split('.')
  // Grabbing the actual filename minus its extension so that we can validate alphanumeric inputs
  var val = fileTypePath[fileTypePath.length - 2];
  var RegEx = /[^0-9a-z]/i;
  var isValid = !(RegEx.test(val));

  // If the value does contain invalid symbols (non-alphanumeric), tell user the input is invalid
  if (isValid === false) {
    console.log('Invalid file type. Please upload an image for which name is alphanumeric and has no spaces.')
    res.json({ 'status': 'incorrect upload type' })
  }

  const currPath = __dirname + "/../public/" + req.query.imageName
  const newPath = __dirname + "/../public/" + req.query.courseID + "/moduleData/" + req.query.imageName

  const made = mkdirp.sync(__dirname + "/../public/" + req.query.courseID + "/moduleData")

  // console.log(req.query)
  fs.rename(currPath, newPath, function (err) {
    if (err) {
      throw err
    } else {
      console.log(`Successfully moved the file ${req.query.imageName}!`);
    }
  });

  const update = await Course.updateOne(
    { _id: req.body.courseID }, // query parameter
    {
      $set: {
        [`modules.${req.body.moduleID}`]: {
          urlFile: "/" + req.query.courseID + "/moduleData/" + req.query.imageName,
        }
      }
    });

  res.send({ "status": "Success" })
})

module.exports = router;