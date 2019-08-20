var express = require('express');
var router = express.Router();
const verification= require('../verification/verification')
const business_controller=require('../controller/business')
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
router.post('/add', business_controller.add_buisness)
router.get('/approve', verification.verifyMail, business_controller.verify_email)
router.post('/login', business_controller.login)
router.get('/get', verification.verifyToken, business_controller.getProfile)
router.post('/update', verification.verifyToken, business_controller.editProfile)
router.post('/updatepassword', verification.verifyToken, business_controller.updatePassword)
router.get('/delete', verification.verifyToken, business_controller.deleteAcc)
router.post('/editbossemail', verification.verifyToken, business_controller.editBossEmail)
router.post('/sethotel', verification.verifyToken, business_controller.setHotel)
router.get('/resethotel', verification.verifyToken, business_controller.resetHotel)
router.post('/setvenue', verification.verifyToken, business_controller.setVenue)
router.get('/resetvenue', verification.verifyToken, business_controller.resetVenue)
router.post('/setcar', verification.verifyToken, business_controller.setCar)
router.get('/resetcar', verification.verifyToken, business_controller.resetCar)
router.post('/setflight', verification.verifyToken, business_controller.setFlight)
router.get('/resetflight', verification.verifyToken, business_controller.resetFlight)
router.post('/setpics', upload.any(), verification.verifyToken, business_controller.updatePics)
router.get('/resetpics', verification.verifyToken, business_controller.resetPics)
module.exports = router;