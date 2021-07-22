const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config.json');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const router = express.Router();

router.post('/registration', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user == undefined) {
            const pass = bcrypt.hashSync(req.body.password, 10);
            const user = new User({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                password: pass,
                roleID: 0,
            });

            const savedUser = await user.save();

            res.json({ 'message': 'added user' });
        }
        else {
            res.status(401).json({ 'message': 'email already connected to an account' });
        }
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

router.post('/forgotPassword', async (req, res) => {
    try {

        const user = await User.findOne({ email: req.body.email });

        if (user !== null) {
            const userID = user._id.toString()

            resetPasswordToken = crypto.randomBytes(20).toString('hex')

            const update = await User.updateOne(
                { _id: userID },
                { $set: { resetPassToken: resetPasswordToken, resetPassExpires: (new Date()).setHours((new Date()).getHours() + 1) } }
            )


            const transporter = nodemailer.createTransport({
                service: config.emailInfo.service,
                auth: {
                    user: config.emailInfo.emailUsername,
                    pass: config.emailInfo.emailPassword
                },

            })

            const mailOptions = {
                from: config.emailInfo.emailUsername,
                to: user.email,
                subject: 'Link to reset password',
                text:
                    'Click the following link to reset your PEO STRI account password ' +
                    `${config.server_url}/reset/${resetPasswordToken}\n\n`
            }

            transporter.sendMail(mailOptions, (err, response) => {
                if (err) {
                    console.error('there was an error: ', err);
                }
                else {
                    res.status(200).json('recovery email sent');
                }
            })


        }
        res.json({ 'message': 'Success!' })

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
                const token = jwt.sign({ id: user._id, email: req.body.email }, config.key, { expiresIn: '16min' });

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
    let token = '';
    if (req.query.token != undefined)
        token = req.query.token
    else
        token = req.body.token;
    if (token == '' || token == undefined || token == null) {
        res.sendStatus(403);
        return
    }

    jwt.verify(token, config.key, function (err, decoded) {
        if (err) {
            res.json({ 'message': 'wrong token' });
            return
        }

        req.body.userID = decoded.id;
        const timestamp = Math.floor(Date.now() / 1000); // get unix time in seconds
        if (decoded.exp - timestamp < 900) {
            req.body.newToken = jwt.sign({ id: decoded.id, email: decoded.email }, config.key, { expiresIn: '2h' });
        }

    });


    next();

}

router.post('/checkResetCreds', async (req, res) => {

    const user = await User.findOne({ resetPassToken: req.body.resetToken, resetPassExpires: { $gt: Date.now() } }, '_id')

    if (user !== null) {
        res.json({ 'message': 'credentials approved' });
    }
    else {
        res.json({ 'message': 'credentials disapproved' });
    }

})

router.post('/resetPassApproved', async (req, res) => {

    try {

        const user = await User.findOne({ resetPassToken: req.body.resetToken }, '_id');

        if (user !== undefined) {

            const pass = bcrypt.hashSync(req.body.password, 10);

            const update = await User.updateOne(
                { resetPassToken: req.body.resetToken },
                { $set: { password: pass } }
            )

        }
        res.json({ message: "Success!" })

    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }

})

async function getRole(req, res, next) {
    const role = await User.findOne({ _id: req.body.userID }, 'roleID')
    req.body.roleID = role.roleID;

    // fileMulter api call does not allow anything else in the body, so this first
    // line is needed to check roles on fileMulter 'single' route
    req.query.roleID = role.roleID

    next();

}

router.post('/isadmin', verifyToken, getRole, async (req, res) => {

    try {

        let payload = {}
        if (req.body.newToken != undefined)
            payload["newToken"] = req.body.newToken;

        if (req.body.roleID == 2) {
            payload["message"] = "yes"
            res.json(payload)
        } else {
            payload["message"] = "no"
            res.json(payload)
        }

    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }

})

router.post('/iscreator', verifyToken, getRole, async (req, res) => {

    try {

        let payload = {}
        if (req.body.newToken != undefined)
            payload["newToken"] = req.body.newToken;

        if (req.body.roleID == 1 || req.body.roleID == 2) {
            payload["message"] = "yes"
            res.json(payload)
        } else {
            payload["message"] = "no"
            res.json(payload)
        }

    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }

})



module.exports = {
    router,
    verifyToken,
    getRole
};
