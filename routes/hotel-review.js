var express = require('express');
var router = express.Router();
const verification= require('../controller/verification')
var hotel_reviewController=require('../controller/hotel-review')

router.post('/add/:id', verification.verifyToken, hotel_reviewController.addReview)

module.exports = router;