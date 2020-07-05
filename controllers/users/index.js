const User = require('../users/User');
const jwt = require('../../utils/jwt');
const { cookie } = require('../../config/config');

module.exports = {
    get: {
        login(req, res, next) {
            res.render('users/login.hbs')
        },

        register(req, res, next) {
            res.render('users/register.hbs')
        },

        logout(req, res, next) {
            req.user = null;
            res.clearCookie(cookie).redirect('/');
        }
    },

    post: {
        login(req, res, next) {
            const { username, password } = req.body;

            User.findOne({ username })
                .then((user) => {
                    return Promise.all([user.passwordsMatch(password), user])
                }).then(([match, user]) => {
                    if (!match) {
                        next(err); // TODO Add the validator
                        return;
                    }

                    const token = jwt.createToken(user);

                    res.status(201).cookie(cookie, token, { maxAge: 3600000 }).redirect('/');
                });
        },

        register(req, res, next) {
            const { username, password, repeatPassword } = req.body;

            if (username.length < 3) {
                return res.render('users/register.hbs', {
                    message: "Username and Password must be at least 3 characters long and should consist only english letters and digits",
                    oldInput: { username, password, repeatPassword }
                })
            }

            if (password.length < 3) {
                return res.render('users/register.hbs', {
                    message: "Username and Password must be at least 3 characters long and should consist only english letters and digits",
                    oldInput: { username, password, repeatPassword }
                })
            }

            if (password !== repeatPassword) {
                return res.render('users/register.hbs', {
                    message: "Passwords don't match!",
                    oldInput: { username, password, repeatPassword }
                })
            }

            User.findOne({ username })
                .then((currentUser) => {
                    if (currentUser) {
                        throw new Error("Username is already used!");
                    }
                    return User.create({ username, password })
                }).then((createdUser) => {
                    res.redirect('/users/login')
                }).catch((err) => {
                    res.render('users/register.hbs', {
                        message: err.message,
                        oldInput: { username, password, repeatPassword }
                    })
                });
        }
    }
}