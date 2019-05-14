var express = require('express');
var router = express.Router();
const verification= require('../controller/verification')
const venuereviewController=require('../controller/venue-review');

router.post('/add/:id', verification.verifyToken, venuereviewController.addReview)
router.get('/get/:id', venuereviewController.getReviews)
module.exports = router;
