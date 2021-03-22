const express = require('express');
const apiRouter = require('./routes');
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

var corsOptions = {
    origin: "*"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/v0', apiRouter);

app.listen(process.env.PORT || '8080', () => {
    console.log(`Listening on ${process.env.PORT || '8080'}`);
});

