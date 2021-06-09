const Category = require('../models/categories');
const VerifyToken = require('./auth').verifyToken;
const express = require('express');

const router = express.Router();

router.post('/info', VerifyToken, async (req, res) => {
    try {
      let categories = []
      categories = await Category.find()
      res.json({"categories": categories})
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

module.exports = router;