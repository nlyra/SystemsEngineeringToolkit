const multer = require('multer');

//handle upload files
const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(req)
    cb(null, './public')
  },
  filename: (req, file, cb) => {

    cb(null, file.originalname)
  }
});
const upload = multer({ storage: fileStorageEngine })
module.exports = upload;