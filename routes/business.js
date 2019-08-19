var express = require('express');
var router = express.Router();
const verification= require('../verification/verification')
const business_controller=require('../controller/business')

router.post('/add', business_controller.add_buisness)
router.get('/approve', verification.verifyMail, business_controller.verify_email)
router.post('/login', business_controller.login)
router.get('/get', verification.verifyToken, business_controller.getProfile)
module.exports = router;