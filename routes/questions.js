var express = require('express');
var router = express.Router();
var questionController=require('../controller/questions')

router.post('/add', questionController.addQuestion)
router.get('/get', questionController.getQuestions)

module.exports = router;