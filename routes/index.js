var express = require('express');
var router = express.Router();
const bookingController=require('../controller/bookings');
const verification= require('../controller/verification')


router.post('/addhoteluser/:id', verification.verifyToken, bookingController.addHotelBooking)
router.post('/addhotelnonuser/:id', bookingController.addHotelBooking_nonUser)
router.post('/addcaruser/:id', verification.verifyToken, bookingController.addCarBooking)
router.post('/addcarnonuser/:id', bookingController.addCarBooking_nonUser)
router.post('/addvenueuser/:id', verification.verifyToken, bookingController.addVenueBooking)
router.post('/addvenuenonuser/:id', bookingController.addVenueBooking_nonUser)
router.get('/addflightuser/:id', verification.verifyToken, bookingController.addFlight)
router.get('/addflightnonuser/:id', bookingController.addFlight_nonUser)
router.post('/remove', verification.verifyToken, bookingController.removeBooking)

module.exports = router;
