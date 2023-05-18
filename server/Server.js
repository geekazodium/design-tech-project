var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const { AccountHandler } = require('./AccountHandler');

const accountHandler = new AccountHandler();
exports.accountHandler = accountHandler;
var app = express();

var Game = require("./Game").Game;

var protocolRouter = require("./routes/protocol");
var docsRouter = require("./routes/docs");
var commonRouter = require("./routes/common");
var usersRouter = require('./routes/users');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname,"../client")));

app.use('/game', protocolRouter);
app.use('/common', commonRouter);
app.use('/docs', docsRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.sendStatus(err.status);
});

module.exports = app;