var express = require('express');
var router = express.Router();
var userController=require('../controller/user')
var passport=require('passport')
const verification= require('../controller/verification')

/* GET users listing. */
router.get('/googleadd', passport.authenticate('google', {
  scope:['profile', 'email']
}));

router.get('/google', passport.authenticate('google'), userController.addGoogleUser)
router.post('/add', userController.addUser)
router.get('/approve/:id', userController.approveEmail)
router.post('/login', userController.login)
router.get('/getprofile', verification.verifyToken, userController.getProfile)
router.post('/edit', verification.verifyToken, userController.editDetails)
router.post('/changepassword', verification.verifyToken, userController.changePassword)
router.get('/delete', verification.verifyToken, userController.deleteAccount)
router.post('/notify', userController.notifyUsers)
router.get('/request', verification.verifyToken, userController.requestPdf)
router.post('/hotelset', verification.verifyToken, userController.setHotel)
router.get('/hotelreset', verification.verifyToken, userController.resetHotel)
router.post('/venueset', verification.verifyToken, userController.setVenue)
router.get('/venuereset', verification.verifyToken, userController.resetVenue)
router.post('/carset', verification.verifyToken, userController.setCar)
router.get('/resetcar', verification.verifyToken, userController.resetCar)
router.post('/flightset', verification.verifyToken, userController.setFlight)
router.get('/flightreset', verification.verifyToken, userController.resetFlight)


module.exports = router;
