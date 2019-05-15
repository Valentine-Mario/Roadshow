var express = require('express');
var router = express.Router();
var carController=require('../controller/ car')
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

router.post('/add', upload.any('image'), carController.addCar)
router.post('/editimg/:id', upload.any('image'), carController.editImg)

module.exports = router;
