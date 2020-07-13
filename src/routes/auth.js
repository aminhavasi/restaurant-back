const express = require('express');
const router = express.Router();
const persianDate = require('persian-date');
const _ = require('lodash');
const User = require('../models/user');
const Joi = require('@hapi/joi');
//---------------------------------------------------------
persianDate.toLocale('en');
const date = new persianDate().format('YYYY/M/DD');
const registerValidator = (user) => {
    const schema = Joi.object({
        username: Joi.string().max(255).required(),
        email: Joi.string().email().max(255).required(),
        password: Joi.string().required().min(8).max(1024),
    });
    return schema.validate(user);
};

const loginValidator = (user) => {
    const schema = Joi.object({
        email: Joi.string().email().max(255).required(),
        password: Joi.string().required().min(8).max(1024),
    });
    return schema.validate(user);
};
//-------------------------------------------------------------
router.post('/register', async (req, res) => {
    try {
        const { error } = await registerValidator(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        const body = await _.pick(req.body, ['username', 'email', 'password']);
        body.date = date;
        await User.countDocuments((err, count) => {
            if (count === 0) {
                body.isAdmin = true;
            }
        });
        const newUser = await new User(body);
        await newUser.save();
        const resData = _.pick(newUser, ['_id', 'email', 'username', 'date']);
        res.status(201).send(resData);
    } catch (err) {
        res.status(400).send(err);
    }
});

//login routes-------------------------------------------------------------

router.post('/login', async (req, res) => {
    try {
        const { error } = await loginValidator(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        const user = await User.findByCredentials(
            req.body.email,
            req.body.password
        );

        const token = await user.genAuthToken();
        res.header('x-auth', token).status(200).send();
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;
