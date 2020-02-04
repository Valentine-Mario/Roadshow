var express = require('express');
var router = express.Router();
var emailNotificationController=require('../controller/email-notification')

router.post('/add', emailNotificationController.subscribeEmail)

module.exports = router;