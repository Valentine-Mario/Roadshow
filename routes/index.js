var express = require('express');
var router = express.Router();
const bookingController=require('../controller/bookings');
const verification= require('../verification/verification')


router.post('/addhoteluser/:id', verification.verifyToken, bookingController.addHotelBooking)
router.post('/addhotelnonuser/:id', bookingController.addHotelBooking_nonUser)
router.post('/addhotelinviteduser/:id', verification.verifyToken, bookingController.addHotelBookingInvitedUser)
router.post('/addcaruser/:id', verification.verifyToken, bookingController.addCarBooking)
router.post('/addcarnonuser/:id', bookingController.addCarBooking_nonUser)
router.post('/addcarinviteduser/:id', verification.verifyToken, bookingController.addCarBookingInvitedUser)
router.post('/addvenueuser/:id', verification.verifyToken, bookingController.addVenueBooking)
router.post('/addvenuenonuser/:id', bookingController.addVenueBooking_nonUser)
router.post('/addvenueinviteduser/:id', verification.verifyToken, bookingController.addVenueBookingInvitedUser)
router.post('/addflightuser/:id', verification.verifyToken, bookingController.addFlight)
router.post('/addflightnonuser/:id', bookingController.addFlight_nonUser)
router.post('/addflightinviteduser/:id', verification.verifyToken, bookingController.addFlightBookingInvitedUser)
router.get('/getupcoming', verification.verifyToken, bookingController.getAllUpcomingBookings)
router.get('/getpasttrips', verification.verifyToken, bookingController.getAllPastTrips)
router.get('/getcurrenttrips', verification.verifyToken, bookingController.getAllCurrentTrips);
router.get('/getpendingtrips', verification.verifyToken, bookingController.getAllPendingTrips)
router.get('/getdeclinedtrips', verification.verifyToken, bookingController.getAllDeclinedTrips)
router.get('/getapprovedtrips', verification.verifyToken, bookingController.getAllAprovedTrips)
router.get('/gettriptype/:value', verification.verifyToken, bookingController.getBookingType)

module.exports = router;
