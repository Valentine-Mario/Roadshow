var express = require('express');
var router = express.Router();
const verification= require('../controller/verification')
var hotelController= require('../controller/hotels');
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

router.post('/add', upload.any('images'), hotelController.addHotel)

module.exports = router;