const express = require('express');
const router = express.Router();
const request = require('request');


/* GET users listing. */
router.get('/getentities', function (req, res, next) {
    request.get('http://dev.verinote.net:4000/app/getentities', (err, response, body) => {
        res.json(JSON.parse(body));
    })
});
router.post('/clear', function (req, res, next) {
    request.post('http://dev.verinote.net:4000/app/clearstore', (err, response, body) => {
        res.redirect('/');
    })
})

module.exports = router;
