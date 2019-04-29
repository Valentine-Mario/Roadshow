var express = require('express');
var router = express.Router();
var userController=require('../controller/user')
var passport=require('passport')
const verification= require('../controller/verification')

/* GET users listing. */
router.get('/googleadd', passport.authenticate('google', {
  scope:['profile', 'email']
}));

router.get('/google', passport.authenticate('google'), userController.addGoogleUser)
router.post('/add', userController.addUser)
router.get('/approve/:id', userController.approveEmail)
router.post('/login', userController.login)
router.get('/getprofile', verification.verifyToken, userController.getProfile)
router.post('/edit', verification.verifyToken, userController.editDetails)
router.post('/changepassword', verification.verifyToken, userController.changePassword)

module.exports = router;
