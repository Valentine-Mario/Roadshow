var express = require('express');
var router = express.Router();
const approvalController=require('../controller/approve-disapprove')
const verification= require('../verification/verification')


router.post('/approvedisapprove/:id', verification.verifyToken, approvalController.approveOrDisapproveBooooking)
module.exports = router;
