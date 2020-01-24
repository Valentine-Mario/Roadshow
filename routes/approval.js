var express = require('express');
var router = express.Router();
const approvalController=require('../controller/approve-disapprove')
const verification= require('../verification/verification')


router.get('/approve', verification.verifyToken, approvalController.approveBooooking)
router.get('/decline', verification.verifyToken, approvalController.declinedBooing)
module.exports = router;
