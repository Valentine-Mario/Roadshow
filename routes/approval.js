var express = require('express');
var router = express.Router();
const approvalController=require('../controller/approve-disapprove')

router.get('/approve/hotel/:id', approvalController.approveHotel)
router.get('/disapprove/hotel/:id', approvalController.disApproveHotel)
module.exports = router;
