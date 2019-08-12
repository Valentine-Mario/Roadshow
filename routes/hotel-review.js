var express = require('express');
var router = express.Router();
const verification= require('../verification/verification')
var hotel_reviewController=require('../controller/hotel-review')

router.post('/add/:id', verification.verifyToken, hotel_reviewController.addReview)
router.get('/remove/:id/:hotel_id', verification.verifyToken, hotel_reviewController.removeReview)
router.get('/get/:id', hotel_reviewController.getReviews)

module.exports = router;