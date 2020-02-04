var express = require('express');
var router = express.Router();
var invite=require('../controller/invite_user')
const verification= require('../verification/verification')


router.get('/approve',  invite.acceptLink)
router.post('/approved',  invite.accept);
router.get('/delete/:id', verification.verifyToken, invite.deleteInvitedUser)
router.get('/get', verification.verifyToken, invite.getInvitedUser)
router.post('/edit', verification.verifyToken, invite.modifyInvitedUser)
router.post('/editsetting/:id', verification.verifyToken, invite.modifyInvitedUserAccess)
router.get('/getone/:id', invite.getInvitedUserById)
router.post('/changepassword', verification.verifyToken, invite.modifyInvitedUserPassword)
router.get('/getalluser', verification.verifyToken, invite.getAllYourInvitedUser)

module.exports = router;
