var express = require('express');
var router = express.Router();
var userController=require('../controller/user')
var passport=require('passport')

/* GET users listing. */
router.get('/googleadd', passport.authenticate('google', {
  scope:['profile', 'email']
}));
router.get('/google', passport.authenticate('google'), userController.addGoogleUser)

module.exports = router;
