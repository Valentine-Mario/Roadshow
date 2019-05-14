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
router.post('/addimg/:id', upload.any('images'), venueController.addImages)
router.post('/removeimg/:id', venueController.removeImg)
router.post('/addamneties/:id', venueController.addAmenities)
router.post('/removeamneties/:id', venueController.removeAmenities)
router.post('/edit/:id', venueController.editVenue)
router.get('/delete/:id', venueController.deleteVenue)
router.get('/get', venueController.getVenue)
module.exports = router;
