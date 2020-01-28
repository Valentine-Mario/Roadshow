var express = require('express');
var router = express.Router();
var verification=require('../verification/verification')
var payment=require('../controller/payment')


router.post('/add', verification.verifyToken, payment.addCard)
router.get('/get', verification.verifyToken, payment.retriveCard)
router.get('/delete/:id', verification.verifyToken, payment.deleteCard)

module.exports = router;
