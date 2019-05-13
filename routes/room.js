var express = require('express');
var router = express.Router();
var roomController=require('../controller/rooms')
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
router.post('/add/:id', upload.any('images'), roomController.addRoom)
router.post('/addperks/:id', roomController.addPerks)
router.post('/removeperk/:id', roomController.removePerks)
router.post('/edit/:id', roomController.editRoom)
router.post('/editimg/:id', upload.any('images'), roomController.editImg)
router.get('/get', roomController.getRoom)
router.get('/get/:id', roomController.getRoomId)
router.get('/delete/:id', roomController.removeRoom)

module.exports = router;
