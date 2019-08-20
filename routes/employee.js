var express = require('express');
var router = express.Router();
const verification= require('../verification/verification')
const employeeController=require('../controller/employee')

router.post('/add', verification.verifyToken, employeeController.addEmployee)
router.post('/edit/:id', verification.verifyToken, employeeController.modifyEmployee)
router.post('/editrole/:id', verification.verifyToken, employeeController.editRole)
router.get('/delete/:id', verification.verifyToken, employeeController.deleteUser)
router.get('/get/:id', employeeController.getUserById)

module.exports = router;