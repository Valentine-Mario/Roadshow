var express = require('express');
var router = express.Router();
var receiptController=require('../controller/receipts')
var verification=require('../controller/verification')
var multer = require('multer')
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, './files')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload = multer({ storage: storage })

router.post('/add', upload.any('images'), verification.verifyToken, receiptController.add_receipt)
router.post('/addimages/:id', upload.any('images'), verification.verifyToken, receiptController.addImagesToReceipt)
router.post('/edit/:id', verification.verifyToken, receiptController.editReceiptDetails)
router.post('/removeimage/:id', verification.verifyToken, receiptController.removeImageFromReceipt)
router.get('/delete', verification.verifyToken, receiptController.removeReceipt)
router.get('/get', verification.verifyToken, receiptController.getReceipt)

module.exports = router;
