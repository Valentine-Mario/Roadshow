var express = require('express');
var router = express.Router();
const bookingController=require('../controller/bookings');
const verification= require('../controller/verification')


router.post('/addhoteluser/:id', verification.verifyToken, bookingController.addHotelBooking)
router.post('/remove', verification.verifyToken, bookingController.removeBooking)

module.exports = router;
