const express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    mongoose = require('mongoose'),
    config = require('./DB');

//Add for table
const defaultRoute = require('./routes/default.route');
const reportConfigRoute = require('./routes/reportconfig.route');

mongoose.Promise = global.Promise;
mongoose.connect(config.DB, { useNewUrlParser: true }).then(
  () => {console.log('Database is connected11') },
  err => { console.log('Can not connect to the database'+ err)}
);

const app = express();
app.use(bodyParser.json());
app.use(cors());
/*
app.get('/', (req, res) => {
  return res.send('Received a GET HTTP method');
});
*/

//Expose API path for Route
app.use('/', defaultRoute); //http://localhost:4000/ default route
app.use('/report', reportConfigRoute); //http://localhost:4000/report

/*
app.use('/course', courseRoute);
app.use('/video', videoRoute);
app.use('/courseuser', courseuserRoute);
app.use('/quiz', quizRoute);
app.use('/courseusernested', courseusernestedRoute);
app.use('/chatuser', chatUserRoute);
app.use('/chat', chatRoute);
*/

const port = process.env.PORT || 4000;

const server = app.listen(port, function(){
  console.log('Listening on port ' + port);
});
//$ nodemon server
//https://appdividend.com/2018/11/04/angular-7-crud-example-mean-stack-tutorial/