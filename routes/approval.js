var express = require('express');
var router = express.Router();
const approvalController=require('../controller/approve-disapprove')

router.get('/approve/hotel/:id', approvalController.approveHotel)
router.get('/disapprove/hotel/:id', approvalController.disApproveHotel)
router.get('/approve/flight/:id', approvalController.approveFlight)
router.get('/disapprove/flight/:id', approvalController.disApproveFlight)
router.get('/approve/venue/:id', approvalController.approveVenue)
router.get('/disapprove/venue/:id', approvalController.disApproveVenue)
router.get('/approve/car/:id', approvalController.approveCar)
router.get('/disapprove/car/:id', approvalController.disApproveCar)
module.exports = router;
