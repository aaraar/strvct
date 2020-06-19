const express = require('express');
const router = express.Router();
const request = require('request');

/* GET home page. */
router.get('/', (req, res, next) => {
    request.get('http://dev.verinote.net:4000/app/isempty', (err, response, body) => {
        if (err) res.render('error', {title: 'STRVCT', error: err});
        else {
            if (eval(body)) res.render('upload', {title: 'STRVCT'});
            else res.redirect('/visualisation');
        }
    });
});

router.get('/visualisation', (req, res) => {
    request.get('http://dev.verinote.net:4000/app/isempty', (err, response, body) => {
        if (err) res.render('error', {title: 'STRVCT', error: err});
        else {
            if (eval(body)) res.redirect('/');
            else res.render('visualisation', {title: 'STRVCT'})
        }
    });
})

module.exports = router;
