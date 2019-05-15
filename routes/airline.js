var express = require('express');
var router = express.Router();
var airlineController=require('../controller/airline');
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

router.post('/add', upload.any('image'), airlineController.addAirline)
router.post('/editimg/:id', upload.any('image'), airlineController.editImg)
router.post('/edit/:id', airlineController.editName)
router.get('/delete/:id', airlineController.delete)
router.get('/get/:id', airlineController.getId)
router.get('/get', airlineController.get)

module.exports = router;
