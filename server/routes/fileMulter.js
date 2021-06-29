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

  try {
    
    // validating image types in case someone attempts to access route without using frontend
    let validImageTypes = ["PNG", "JPEG", "GIF", "TIF", "RAW", "JPG"]
    
    // Checking to see if the extension is one of the valid types
    const imageTypePath = req.query.imageName.split('.')
    const imageType = imageTypePath[imageTypePath.length - 1]
    const validInput = validImageTypes.includes(imageType.toUpperCase());

    // If it isn't, return and allow user to input valid image
    if (!validInput) {
      alert('Invalid file type. Please upload an image with a proper image extension')
      res.json({ 'status': 'Incorrect upload type' })
    }

    // Grabbing the actual filename minus its extension so that we can validate alphanumeric inputs
    var val = imageTypePath[imageTypePath.length - 2];
    var RegEx = /[^0-9a-z]/i;
    var isValid = !(RegEx.test(val));

    // If the value does contain invalid symbols (non-alphanumeric), tell user the input is invalid
    if (isValid === false) {
      console.log('Invalid file type. Please upload an image for which name is aplhanumeric.')
      res.json({ 'status': 'incorrect upload type' })
    }

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
  }
  catch (e){
    console.log(e);
    // res.sendStatus(500);
  }
  
})

module.exports = router;