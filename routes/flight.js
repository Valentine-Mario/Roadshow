var express = require('express');
var router = express.Router();
var flightController=require('../controller/flight')

router.post('/add/:id', flightController.addFlight)
router.post('/edit/:id', flightController.editFlight)
router.get('/delete/:id', flightController.deleteFlight)
router.get('/get', flightController.getAllFlight)
router.get('/get/:id', flightController.getFlightId)
router.get('/getairline/:id', flightController.getFlightForAirline)
router.get('/search/:value/:value2', flightController.sortDestination)
router.get('/sortclass/:value', flightController.sortClass);
module.exports = router;
