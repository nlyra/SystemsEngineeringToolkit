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
			});
			
			const savedUser = await user.save();

			console.log('added user ', savedUser._id);

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

        console.log(user._id)

		if (user === null) {

            res.json({ 'message': 'Account not found in db' });
		}
		else {
            console.log(user._id)
                res.json({ 'message': 'Account found in db' });

                token = crypto.randomBytes(20).toString('hex')

                // User.update(
                //     {'_id':req.body.userID}, // query parameter
                //     {
                //     $set: {
                //      'last_name': 'molar'
                //  }});
                // const updatedUser = User.update({'_id': user._id}, // query parameter
                //     { $set: {"resetPassToken": token}
                    
                //     //   "resetPassExpires": {Date.now() * 3600000}
                //     });
                //     // console.log(updatedUser)
                      
                const transporter = nodemailer.createTransport({
                    service: config.emailInfo.service,
                    auth: {
                        user: config.emailInfo.emailUsername,
                        pass: config.emailInfo.emailPassword
                    },

                })
                // console.log(user.email)
                const mailOptions = {
                    from: config.emailInfo.emailUsername,
                    to: user.email,
                    subject: 'Link to reset password',
                    text:
                    'Click the following link to reset your account password ' +
                    `http://localhost:3000/reset/${token}\n\n`
                }

                transporter.sendMail(mailOptions, (err, response) => {
                    if (err) {
                        console.error('there was an error: ', err);
                    }
                    else {
                        console.log('here is the res: ', response);
                        res.status(200).json('recovery email sent');
                    }
                })
			// res.status(401).json({ 'message': 'email already connected to an account' });
		}
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
