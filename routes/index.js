var express = require('express');
var router = express.Router();
const bookingController=require('../controller/bookings');
const verification= require('../controller/verification')


router.post('/add', verification.verifyToken, bookingController.addBooking)
router.post('/remove', verification.verifyToken, bookingController.removeBooking)

module.exports = router;
