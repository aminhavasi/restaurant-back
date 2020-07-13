const express = require('express');
const router = express.Router();
const _ = require('lodash');
const Menu = require('./../models/menu');

// router.get('/',async(req,res)=>{

// })

router.post('/create', async (req, res) => {
    try {
        const body = _.pick(req.body, ['name', 'cat', 'price']);
        const newItem = new Menu(body);
        console.log(newItem);
        newItem.save();

        res.send('ok');
    } catch (err) {}
});
module.exports = router;
