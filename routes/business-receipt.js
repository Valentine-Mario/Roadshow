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
router.post('/addimg/:id', upload.any(), verification.verifyToken, receiptController.addImages)
router.post('/edit/:id', verification.verifyToken, receiptController.editReceipt)
router.post('/removeimg/:id', verification.verifyToken, receiptController.removeImages)
router.get('/delete/:id', verification.verifyToken, receiptController.removeReceipt)
router.get('/get', verification.verifyToken, receiptController.getReceipt)
router.get('/get/:id', receiptController.getReceiptById)
router.post('/filter', verification.verifyToken, receiptController.getRceiptByDay)

module.exports = router;
