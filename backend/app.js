const express = require("express");
const cookieParser = require('cookie-parser');
const logger = require('morgan');

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

module.exports = app;