const express = require('express');
const registerRouter = express.Router();
const QrCode = require('qrcode');
const speakeasy = require('speakeasy');
const userService = require('../db/services/user-service');


let temporary_secret_key;

registerRouter.get('/', (req, res) => {
    res.render('register');
});

registerRouter.get('/success', (req, res) => {
    const { query } = req;
    res.render('register-success', { user:query.user });
});
registerRouter.get('/two-step-verification', (req, res) => {
    const { query } = req;
    temporary_secret_key = speakeasy.generateSecret({ name:'user_secret_key' });
    QrCode.toDataURL(temporary_secret_key.otpauth_url, (error, data_url) => {
        if (!error) {
            res.render('two-step-registration', {
                qrcodeUrl:data_url,
                user:query.user
            });
        }
    });
});

registerRouter.get('/verify_secret_key', (req, res) => {
    const { query } = req;
    res.render('verify-secret-key', {
        user:query.user
    });
});

registerRouter.post('/', (req, res, next) => {
    const { body } = req;
    userService.register(body).then(() => res.status(200).redirect(`/register/success?user=${body.email}`))
        .catch((error) => next(error));
});

registerRouter.post('/verify_secret_key', (req, res, next) => {
    const { body, query } = req;
    const isValid = speakeasy.totp.verify({
        secret:temporary_secret_key.base32,
        encoding:'base32',
        token:body.code
    });
    if (isValid) {
        userService.updateUserInfoWithSecretKey({ userEmail:query.user, userSecretKey:temporary_secret_key.base32 })
            .then(() => res.render('secret-key-verify-success'))
            .catch(error => next(error));
    } else console.log('An error occurred when verifying user secret key');
});

module.exports = registerRouter;

