const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const router = express.Router();

router.get('', async (req, res) => {
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

router.get('/login', async (req, res) => {
    try {
        // get user from DB
        const user = await User.findOne({ email: req.body.email });
        if (user != undefined) {
            // check if passwords match
            if (req.body.password != undefined && bcrypt.compareSync(req.body.password, user.password)) {
                // everything is correct
                //eventually create a token or json web token to continue validating user.

                // set payload and return response
                let payload = {
                    "message": "success"
                }
                res.json(payload);
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



module.exports = router;
