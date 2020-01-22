var express = require('express');
var router = express.Router();
const verification= require('../verification/verification')
const employeeController=require('../controller/employee')

router.post('/add', verification.verifyToken, employeeController.addEmployee)
router.post('/editrole/:id', verification.verifyToken, employeeController.editName)
router.get('/delete/:id', verification.verifyToken, employeeController.deleteGroup)
router.get('/get', verification.verifyToken, employeeController.getEmployee)
router.post('/addname', verification.verifyToken, employeeController.addNameToGroup)

module.exports = router;