const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const cors = require("cors");
const authRoute = require('./routes/auth').router;
const coursesRoute = require('./routes/courses');
const config = require('./config.json');

const app = express();

var corsOptions = {
    origin: "*"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// connect to db
//(i called my db se_toolkit so it would be [url + /se_toolkit])
mongoose.connect(config.db_url,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    () => console.log('connected to DB!')
);

//serve static files
app.use(express.static('public'));


app.use('/api/v0/auth', authRoute);
app.use('/api/v0/courses', coursesRoute);

app.listen(process.env.PORT || '4000', () => {
    console.log(`Listening on ${process.env.PORT || '4000'}`);
});

