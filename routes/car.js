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
router.post('/addinfo/:id', carController.addInfo)
router.post('/addreq/:id', carController.addRequirements)
router.post('/removeinfo/:id', carController.removeInfo)
router.post('/removereq/:id', carController.removeRequirements)
router.post('/edit/:id', carController.editCar)
router.get('/delete/:id', carController.deleteCar)
router.get('/get', carController.getCars)
router.get('/get/:id', carController.getCar)
router.get('/search/:value', carController.searchCar)
module.exports = router;
