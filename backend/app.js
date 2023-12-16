const express = require("express");
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const debug = require("debug")

const cors = require("cors")
const csurf = require("csurf")
const {isProduction} = require("./config/keys")

const usersRouter = require('./routes/api/users'); // update the import file path
const tweetsRouter = require("./routes/api/tweets");
const csrfRouter = require("./routes/api/csrf");

const app = express();

app.use(logger('dev')); // log request components (URL/method) to terminal
app.use(express.json()); // parse JSON request body
app.use(express.urlencoded({ extended: false })); // parse urlencoded request body
app.use(cookieParser()); // parse cookies as an object on req.cookies



if (!isProduction) {
    app.use(cors())
}


app.use((req, res, next) => {
    const err = new Error("Not Found");
    err.statusCode = 404;
    next(err);
});

const serverErrorLogger = debug("backend:error");



app.use(
    csurf({
        cookie: {
            secure: isProduction,
            sameSite: isProduction && "LAX",
            httpOnly: true
        }
    })
);


// Attach Express routers
app.use('/api/users', usersRouter); // update the path
app.use("/api/tweets", tweetsRouter)
app.use("/api/csrf", csrfRouter)
app.use((err, req, res, next) => {
    serverErrorLogger(err);
    const statusCode = err.statusCode || 500;
    res.status(statusCode);
    res.json({
        message: err.message,
        statusCode,
        errors: err.errors
    })
})

module.exports = app;