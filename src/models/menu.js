const mongoose = require('mongoose');
const menuScema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        cat: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        image: {
            type: String,
        },
    },
    { timestamps: true }
);

const Menu = mongoose.model('Menu', menuScema);
module.exports = Menu;
