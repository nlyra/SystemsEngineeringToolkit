const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/hola', verifyToken, async (req, res) => {
    try {
        // set payload and return res
        let payload = {
            "status": "Welcome to SE Toolkit Server"
        }
        res.json(payload);

    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

router.post('/login', async (req, res) => {
    try {
        // get user from DB
        const user = await User.findOne({ email: req.body.email });
        if (user != undefined) {
            // check if passwords match
            if (req.body.password != undefined && bcrypt.compareSync(req.body.password, user.password)) {
                // everything is correct

                // token handling  (we might discuss what will be the secret key)
                const token = jwt.sign({ email: req.body.email }, 'secretkey', { expiresIn: '2h' });
                
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
    console.log(token)
    if (token === undefined) {
        res.sendStatus(403);
    }

    jwt.verify(token, 'secretkey', function (err, decoded) {
        if (err) {
            console.log(err.message)
            res.sendStatus(403)
        }
    });

    next();

}



module.exports = router;
