const Category = require('../models/categories');
const VerifyToken = require('./auth').verifyToken;
const GetRole = require('./auth').getRole;
const express = require('express');

const router = express.Router();

router.post('/info', VerifyToken, GetRole, async (req, res) => {
    try {
      if(req.body.roleID != 1  && req.body.roleID != 2){
        res.json({ message: "unauthorized" })
        return
      }

      let categories = []
      categories = await Category.find()
      res.json({"categories": categories})
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

router.post('/add', VerifyToken, GetRole, async (req, res) => {

    if(req.body.roleID != 1 && req.body.roleID != 2){
      res.json({ message: "unauthorized" })
      return
    }


    try {
      const newCat = new Category({
        label: req.body.label
      })
  
      const savedCategory = await newCat.save();
  
      console.log('added category ', savedCategory._id);
  
      res.json(savedCategory);
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  })

module.exports = router;