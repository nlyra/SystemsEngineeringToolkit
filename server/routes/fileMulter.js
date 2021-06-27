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
  
  if(req.body.roleID === 1){
    res.json({ message: "unauthorized" })
    return
  }

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

module.exports = router;