const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('homepage');
});

router.get('/secret', (req, res) => {
    if (req.session.isAuthenticated) {
        res.render('secret');
    } else {
        res.status(401).render('unauthorized');
    }
});

module.exports = router;
