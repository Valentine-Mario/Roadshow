var express = require('express');
var router = express.Router();
const verification= require('../controller/verification')
var car_reviewController=require('../controller/car-review')


router.post('/add/:id', verification.verifyToken, car_reviewController.addReview)
router.get('/get/:id', car_reviewController.getReviews)

module.exports = router;