var express = require('express');
var router = express.Router();
var adminController=require('../controller/admin')
const verification= require('../controller/verification')


router.get('/getusers', verification.verifyToken, adminController.getAllUsers)
router.get('/getuser/:id', verification.verifyToken, adminController.getUserId)
router.post('/edituser/:id', verification.verifyToken, adminController.editUser)
router.get('/approve/:id', verification.verifyToken, adminController.approveUser)
router.get('/unapprove/:id', verification.verifyToken, adminController.unapproveUser)
router.get('/makeadmin/:id', verification.verifyToken, adminController.makeAdmin)
router.get('/removeadmin/:id', verification.verifyToken, adminController.removeAdmin)
router.get('/delete/:id', verification.verifyToken, adminController.deleteUser)

module.exports = router;
