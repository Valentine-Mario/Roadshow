

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
var googleSetUp= require('./setup')
require('dotenv').config()
var app = express();

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

var url='mongodb://localhost:27017/road-show'

mongoose.Promise= global.Promise;
mongoose.connect(url, { useNewUrlParser: true });

app.use('/car', carRouter)
app.use('/venuereview', venuereviewRouter)
app.use('/venue', venueRouter)
app.use('/hotelreview', hotelreviewRouter)
app.use('/room', roomRouter)
app.use('/hotel', hotelRouter)
app.use('/booking', indexRouter);
app.use('/user', usersRouter);
app.use('/admin', adminRouter)

module.exports = app;


