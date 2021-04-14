const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config.json');

const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        // get user from DB
        const user = await User.findOne({ email: req.body.email });
        if (user != undefined) {
            // check if passwords match
            if (req.body.password != undefined && bcrypt.compareSync(req.body.password, user.password)) {
                // everything is correct

                // token handling  (we might discuss what will be the secret key)
                const token = jwt.sign({ email: req.body.email }, config.key, { expiresIn: '2h' });

                // set payload and return response
                res.json({ token: token });
                return

            }

        }
        // email or password did not match
        res.status(401).json({ "message": "wrong email or password" })


    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

function verifyToken(req, res, next) {
    // get auth header value
    const token = req.body.token;
    if (token === undefined) {
        res.sendStatus(403);
    }

    jwt.verify(token, config.key, function (err, decoded) {
        if (err) {
            console.log(err.message)
            res.sendStatus(403)
        }
    });

    // console.log("verified")
    next();

}


// module.exports= verifyToken;
module.exports = {
    router,
    verifyToken
};
