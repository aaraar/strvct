const express = require('express');
const router = express.Router();
const request = require('request');

/* GET home page. */
router.get('/', function (req, res, next) {
    request.get('http://dev.verinote.net:4000/app/isempty', (err, response, body) => {
        if (err) res.render('error', {title: 'STRVCT', err});
        else {
            if (!eval(body)) res.render('index', {title: 'STRVCT'});
            else res.render('upload', {title: 'STRVCT'});
        }
    });
});

module.exports = router;
