const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        tokens: [
            {
                _id: false,
                access: {
                    type: String,
                    required: true,
                },
                token: {
                    type: String,
                    required: true,
                },
            },
        ],
        date: {
            type: String,
        },
    },
    { timestamps: true }
);

//----
userSchema.statics.findByCredentials = function (email, password) {
    let User = this;
    return User.findOne({ email }).then((user) => {
        if (!user) {
            return Promise.reject();
        }
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    resolve(user);
                } else {
                    reject();
                }
            });
        });
    });
};
userSchema.methods.genAuthToken = function () {
    let user = this;
    let access = 'auth';
    let token = jwt
        .sign(
            {
                _id: user._id.toHexString(),
                access,
                isAdmin: user.isAdmin,
            },
            process.env.SECRET_KEY
        )
        .toString();
    user.tokens.push({ access, token });
    return user.save().then(() => {
        return token;
    });
};

userSchema.pre('save', function (next) {
    let user = this;
    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) throw new Error('something went wrong');
            bcrypt.hash(user.password, salt, (err, hash) => {
                if (err) throw new Error('something went wrong');

                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
