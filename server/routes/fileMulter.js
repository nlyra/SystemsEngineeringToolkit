const multer = require('multer');
const express = require('express');

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

router.post('/single', upload.single('file'), (req, res) => {
  res.send({ "status": "Success"})
})

module.exports = router;