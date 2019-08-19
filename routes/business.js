var express = require('express');
var router = express.Router();
const verification= require('../verification/verification')
const business_controller=require('../controller/business')

router.post('/add', business_controller.add_buisness)
router.get('/approve', verification.verifyMail, business_controller.verify_email)

module.exports = router;