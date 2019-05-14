var express = require('express');
var router = express.Router();
const venueController=require('../controller/venues');
var multer = require('multer')
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, './files')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload = multer({ storage: storage })
router.post('/add', upload.any('images'), venueController.addVenue)


module.exports = router;
