var express = require('express');
var router = express.Router();
var verification=require('../verification/verification')
var multer = require('multer')
const receiptController=require('../controller/business-receipt')
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, './files')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload = multer({ storage: storage })

router.post('/add', upload.any(), verification.verifyToken, receiptController.addReceipt)

module.exports = router;
