var express = require('express');
var router = express.Router();
var verification=require('../verification/verification')
const bookingController=require('../controller/business-booking')

router.post('/addhotel/:id', verification.verifyToken, bookingController.addHotel)
router.get('/gethotel/:number', verification.verifyToken, bookingController.getHotelBooking)
router.get('/flight/:id', verification.verifyToken, bookingController.addFlight)
router.get('/getflight/:number', verification.verifyToken, bookingController.getFlightBooking)
router.post('/addvenue/:id', verification.verifyToken, bookingController.addVenue)
router.get('/getvenue/:number', verification.verifyToken, bookingController.getVenueBooking)
router.post('/car/:id', verification.verifyToken, bookingController.addCarBooking)
router.get('/getcar/:number', verification.verifyToken, bookingController.getCarBooking)
module.exports = router;
