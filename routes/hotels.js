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
router.post('/addimg/:id', upload.any('images'), hotelController.addImages)
router.post('/removeimg/:id', hotelController.removeImg)
router.post('/addinfo/:id', hotelController.addInfo)
router.post('/removeinfo/:id', hotelController.removeInfo)
router.post('/addinterest/:id', hotelController.addInterest)
router.post('/removeinterest/:id', hotelController.removeInterest)
router.post('/edit/:id', hotelController.editDetails)
router.get('/delete/:id', hotelController.deleteDetails)
router.get('/get', hotelController.getHotels)
router.get('/get/:id', hotelController.getHotelId)
router.get('/search/:value', hotelController.searchHotel)

module.exports = router;