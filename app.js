let express = require('express');
const createError = require('http-errors');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
const cors = require('cors');
const config = require("config");
const databtase = require("./database");
const indexRouter = require('./routes/index');
const groupRouter = require('./routes/group');
const usersRouter = require('./routes/users');
const proposalsRouter = require('./routes/proposals');
var admin = require('firebase-admin');

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/users', usersRouter);
app.use('/api/groups', groupRouter);
app.use('/api/proposals', proposalsRouter);
app.use('/api', indexRouter);
// admin.initializeApp({
//   credential: admin.credential.applicationDefault(),
//   databaseURL: 'https://se-uni.firebaseio.com'
// });
// getAccessToken()
if (!config.get("myprivatekey")) {
  console.error("FATAL ERROR: Private Key is not defined.");
  process.exit(1);
}
console.log(databtase);

app.use(function(req, res, next) {
  console.log("here")
  next(createError(404));
});

app.use('/*', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.sendFile(__dirname + '/public/index.html');

  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};
  //
  // // render the error page
  // res.status(err.status || 500);
  // res.send('error');
});
module.exports = app;

function getAccessToken() {
  return new Promise(function(resolve, reject) {
    const key = require('service-account-file.json');
    const jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      SCOPES,
      null
    );
    jwtClient.authorize(function(err, tokens) {
      if (err) {
        reject(err);
        return;
      }
      resolve(tokens.access_token);
    });
  });
}
