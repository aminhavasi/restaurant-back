const express = require('express');
const router = express.Router();
const _ = require('lodash');
const Menu = require('./../models/menu');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
    const resMenu = [];
    try {
        const menu = await Menu.find({});
        menu.forEach((menuKey) => {
            resMenu.push(_.pick(menuKey, ['_id', 'name', 'price', 'cat']));
        });
        res.status(200).send(resMenu);
    } catch (err) {
        res.send(err);
    }
});

router.post('/create', auth, async (req, res) => {
    try {
        const body = _.pick(req.body, ['name', 'cat', 'price']);
        const newItem = await new Menu(body);
        await newItem.save();
        res.status(200).send('success');
    } catch (err) {
        res.send(err);
    }
});
module.exports = router;
