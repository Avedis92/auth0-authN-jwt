const express = require('express');
const logoutRouter = express.Router();

logoutRouter.get('/', (req, res) => {
    req.session.destroy();
    res.render('logout');
});

module.exports = logoutRouter;
