var express = require('express');
var router = express.Router();
var verification=require('../verification/verification')
const bookingController=require('../controller/business-booking')

router.post('/addhotel/:id', verification.verifyToken, bookingController.addHotel)

module.exports = router;
