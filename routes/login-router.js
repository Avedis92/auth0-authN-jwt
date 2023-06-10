const express = require('express');
const loginRouter = express.Router();
const speakeasy = require('speakeasy');
const userService = require('../db/services/user-service');


loginRouter.get('/', (req, res) => {
    res.render('login');
});

loginRouter.get('/verify-login', (req, res) => {
    const { query } = req;
    res.render('verify-login-code', {
        user:query.user
    });
});
loginRouter.get('/success-auth', (req, res) => {
    res.render('login-success-auth');
});

loginRouter.post('/', (req, res) => {
    const { body } = req;
    userService.verifyUserLoginInfo(body).then((user) => {
        if (user) {
            res.redirect(`/login/verify-login?user=${body.email}`);
        } else {
            res.status(404).render('login-failed');
        }
    });
});

loginRouter.post('/verify-login', (req, res, next) => {
    const { query, body } = req;
    userService.extractUserSecretKey(query.user)
        .then(userSecretKey => {
            if (userSecretKey) {
                const isValid = speakeasy.totp.verify({
                    secret:userSecretKey,
                    encoding:'base32',
                    token:body.code
                });
                if (isValid) {
                    req.session.isAuthenticated = true;
                    res.redirect('/login/success-auth');
                } else {
                    req.session.isAuthenticated = false;
                    res.redirect('/login');
                }
            }
        })
        .catch(error => next(error));
});

module.exports = loginRouter;
