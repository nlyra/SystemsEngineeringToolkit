const express = require('express');
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

module.exports = router;
