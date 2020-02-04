var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose=require('mongoose')
const passport = require('passport');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
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
var employeeRouter=require('./routes/employee')
var approvalRouter=require('./routes/approval')
var inviteRouter=require('./routes/invite')
var paymentRoute=require('./routes/payment')
var email_notification=require('./routes/email-notification');
var questions=require('./routes/questions')
var bodyParser = require('body-parser')
var googleSetUp= require('./setup')
require('dotenv').config()
var timeout = require('express-timeout-handler');
var app = express();

app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true}));
app.use(passport.initialize());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
var exphbs  = require('express-handlebars');
app.use(passport.initialize());
app.use(passport.session());


app.use(function(req, res, next) {
  
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  
  });

var url=process.env.MONGODB_CLOUD
mongoose.Promise= global.Promise;
mongoose.connect(url, { useNewUrlParser: true }).catch((error) => { console.log(error); });
var options = {
  timeout: 120000,
 
  onTimeout: function(req, res) {
    res.status(503).json({code:"01", message:"service timed out"});
  },
 
};
 
app.use(timeout.handler(options));
 

// view engine setup

var hbs = exphbs.create({ /* config */ });

// Register `hbs.engine` with the Express app.
app.engine('.hbs', exphbs({ extname: '.hbs', defaultLayout:false }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.hbs');

//routing
app.use('/approval', approvalRouter)
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
app.use('/invite', inviteRouter)
app.use('/card', paymentRoute)
app.use('/email', email_notification)
app.use('/question', questions)

module.exports = app;


