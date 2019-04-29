var express = require('express');
var router = express.Router();
var adminController=require('../controller/admin')
const verification= require('../controller/verification')


router.get('/getusers', verification.verifyToken, adminController.getAllUsers)
router.get('/getuser/:id', verification.verifyToken, adminController.getUserId)

module.exports = router;
