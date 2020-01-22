var express = require('express');
var router = express.Router();
var invite=require('../controller/invite_user')
const verification= require('../verification/verification')


router.get('/approve',  invite.acceptLink)
router.post('/approved',  invite.accept);
router.get('/delete/:id', verification.verifyToken, invite.deleteInvitedUser)
router.get('/get', verification.verifyToken, invite.getInvitedUser)

module.exports = router;
