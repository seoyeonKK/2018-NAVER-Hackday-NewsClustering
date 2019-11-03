const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const logger = require('morgan');
const log = require('./module/Logger');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(cors());

app.use((req, res, next) => {
    res.r = (result) => {
        res.json({
            status: 200,
            message: "success",
            result,
        });
    };
    next();
});


// create DB pool
// require('./config/config').createDBPool(10);

require('./src/routes')(app);

app.use(function(req, res, next)
{
    var err = new Error('Not Found');
    err.status = 404;
    err.path = req.path;
    log.error(err);
    next(err);
});

// error handler
require('./ErrorHandler')(app);

const PORT = 3000;
app.listen(PORT, () => {
    console.info(`[ApiServer] Listening on Port ${PORT}`);
});


module.exports = app;