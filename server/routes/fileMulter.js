const multer = require('multer');
const express = require('express');
const VerifyToken = require('./auth').verifyToken;
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

router.post('/single', VerifyToken, upload.single('file'), async (req, res) => {

  console.log(req.query)
  const currPath = __dirname + "/../public/" + req.query.imageName
  const newPath = __dirname + "/../public/" + req.query.courseID + "/" + req.query.imageName

  const made = mkdirp.sync(__dirname + "/../public/" + req.query.courseID)

  // console.log(req.query)
  fs.rename(currPath, newPath, function (err) {
    if (err) {
      throw err
    } else {
      console.log(`Successfully moved the file ${req.query.imageName}!`);
    }
  });

  const update = await Course.updateOne(
    { _id: req.query.courseID },
    { $set: { "urlImage": config.server_url + "/" + req.query.courseID + "/" + req.query.imageName } }
  )

  res.send({ "status": "Success" })
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

  // const update = await Course.updateOne(
  //   { _id: req.body.courseID }, // query parameter
  //   {
  //     $set: {
  //       [`modules.${req.body.moduleID}`]: {
  //           urlFile: config.server_url + "/" + req.query.courseID + "/moduleData/" + req.query.imageName,
  //       }
  //     }
  //   });

  res.send({ "status": "Success" })
})

module.exports = router;