var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose=require('mongoose')
const passport = require('passport');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter= require('./routes/admin');
var hotelRouter= require('./routes/hotels');
var roomRouter=require('./routes/room');
var hotelreviewRouter=require('./routes/hotel-review')
var venueRouter=require('./routes/venues')
var venuereviewRouter=require('./routes/venue-review')
var carRouter=require('./routes/car')
var carreviewRouter=require('./routes/car-review')
var airlineRouter=require('./routes/airline')
var flightRouter=require('./routes/flight')
var receiptRouter=require('./routes/receipts')
var businessRouter=require('./routes/business')
var employeeRouter=require('./routes/employee')
var businessreceiptRouter=require('./routes/business-receipt')
var businessbookingRouter=require('./routes/business-bookings')
var approvalRouter=require('./routes/approval')
var bodyParser = require('body-parser')
var googleSetUp= require('./setup')
require('dotenv').config()
var timeout = require('express-timeout-handler');
var app = express();

app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb"}));
app.use(passport.initialize());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());


app.use(function(req, res, next) {
  
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  
  });

var url=process.env.MONGODB_DEV
mongoose.Promise= global.Promise;
mongoose.connect(url, { useNewUrlParser: true }).catch((error) => { console.log(error); });
var options = {
  timeout: 120000,
 
  onTimeout: function(req, res) {
    res.status(503).json({code:"01", message:"service timed out"});
  },
 
};
 
app.use(timeout.handler(options));
 

app.use('/bizbookin', approvalRouter)
app.use('/businessbooking', businessbookingRouter)
app.use('/businessreceipt', businessreceiptRouter)
app.use('/employee', employeeRouter)
app.use('/receipt', receiptRouter)
app.use('/flight', flightRouter)
app.use('/airline', airlineRouter)
app.use('/carreview', carreviewRouter)
app.use('/car', carRouter)
app.use('/venuereview', venuereviewRouter)
app.use('/venue', venueRouter)
app.use('/hotelreview', hotelreviewRouter)
app.use('/room', roomRouter)
app.use('/hotel', hotelRouter)
app.use('/booking', indexRouter);
app.use('/user', usersRouter);
app.use('/admin', adminRouter)
app.use('/business', businessRouter)

module.exports = app;


