const express = require('express');
const router = express.Router();
const _ = require('lodash');
const Joi = require('@hapi/joi');

const Menu = require('./../models/menu');
const auth = require('../middleware/auth');
//joi-------------------------------------------------

const menuValidator = (menu) => {
    const schema = Joi.object({
        name: Joi.string().max(255).required(),
        cat: Joi.string().max(255).required(),
        price: Joi.number().required(),
    });
    return schema.validate(menu);
};

//----------------------------------------------------

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
        const { error } = await menuValidator(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        const body = _.pick(req.body, ['name', 'cat', 'price']);
        const newItem = await new Menu(body);
        await newItem.save();
        res.status(200).send('success');
    } catch (err) {
        res.send(err);
    }
});

router.put('/:id', auth, async (req, res) => {
    try {
        const { error } = await menuValidator(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        const menu = await Menu.findByIdAndUpdate(
            req.params.id,
            {
                cat: req.body.cat,
                name: req.body.name,
                price: req.body.price,
            },
            { new: true }
        );

        if (!menu)
            return res.status(404).send('There is not menu for the given id');
        res.status(200).send(menu);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const menu = await Menu.findOneAndRemove(req.params.id);
        if (!menu)
            return res.status(404).send('There is not menu for the given id');
        res.status(200).send('success removing');
    } catch (err) {
        res.status(400).send(err);
    }
});
module.exports = router;
