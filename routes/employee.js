var express = require('express');
var router = express.Router();
const verification= require('../verification/verification')
const employeeController=require('../controller/employee')

router.post('/add', verification.verifyToken, employeeController.addEmployee)
router.post('/edit/:id', verification.verifyToken, employeeController.editName)
router.get('/delete/:id', verification.verifyToken, employeeController.deleteGroup)
router.get('/get', verification.verifyToken, employeeController.getEmployee)
router.post('/addname/:id', verification.verifyToken, employeeController.addNameToGroup)
router.get('/getone/:id', employeeController.getGroupById)
router.post('/deletename/:id', verification.verifyToken, employeeController.deleteNameFromGroup)

module.exports = router;