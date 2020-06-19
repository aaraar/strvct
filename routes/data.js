const express = require('express');
const router = express.Router();
const database = require('../controllers/db');
const moment = require('moment-timezone');
const multer = require('multer')
const upload = multer();
const request = require('request');

/* GET users listing. */
router.get('/getentities/:var(old|new)?', function (req, res, next) {
    request.get('http://dev.verinote.net:4000/app/getentities', (err, response, body) => {
        res.json(JSON.parse(body));
    })
});

router.post('/clear', function (req, res, next) {
    const mongo = database.get();
    const dataset = mongo.db('strvct').collection('dataset');
    request.post('http://dev.verinote.net:4000/app/clearstore', (apiErr, response, body) => {
        if (apiErr) {
            console.error(apiErr);
            res.render('error', {title: 'STRVCT', error: apiErr});
        } else {
            dataset.updateOne(
                {doc: 'info'},
                {
                    $set: {
                        lastModified: moment.tz('Europe/Amsterdam').format()
                    }
                },
                {upsert: true})
                .then((result, dbErr) => {
                    if (dbErr) {
                        res.render('error', {title: 'STRVCT', error: dbErr});
                    } else {
                        res.json({data: 'okay'});
                    }
                });

        }
    })
})

router.post('/upload', upload.single('dataset'), (req, res) => {
    const mongo = database.get();
    const dataset = mongo.db('strvct').collection('dataset');
    let formData = {
        contentType: 'multipart/form-data',
        //file field need set options 'contentType' and 'filename' for formData
        'file': {
            value: req.file.buffer,
            options: {
                contentType: req.file.mimetype,
                filename: req.file.originalname
            }
        }
    };
    request.post({
        url: 'http://dev.verinote.net:4000/app/uploadvocabulary',
        formData
    }, (apiErr, response, body) => {
        if (apiErr) {
            console.error(apiErr);
            res.render('error', {title: 'STRVCT', error: apiErr});
        } else {
            dataset.updateOne (
                { doc: 'info' },
                {
                    $set: {
                        lastModified: moment.tz('Europe/Amsterdam').format()
                    }
                },
                { upsert: true } )
                .then ((result, dbErr) => {
                    if (dbErr) {
                        res.render('error', {title: 'STRVCT', error: dbErr});
                    } else {
                        res.redirect('/');
                    }
                });

        }
    });
});

router.get('/lastmod', (req, res) => {
    const mongo = database.get();
    const dataset = mongo.db('strvct').collection('dataset');
    dataset.findOne(
        { doc: 'info' }).then( data => {
            res.json(data);
    })
})

router.post('/addentity', (req, res) => {
    const mongo = database.get();
    const dataset = mongo.db('strvct').collection('dataset');
    console.log(req.body);
    request.post({
        url: 'http://dev.verinote.net:4000/app/addentity',
        json: JSON.stringify(req.body)
    }, (apiErr, response, body) => {
        if (apiErr) {
            console.error(apiErr);
            res.render('error', {title: 'STRVCT', error: apiErr});
        } else {
            dataset.updateOne (
                { doc: 'info' },
                {
                    $set: {
                        lastModified: moment.tz('Europe/Amsterdam').format()
                    }
                },
                { upsert: true } )
                .then ((result, dbErr) => {
                    if (dbErr) {
                        res.render('error', {title: 'STRVCT', error: dbErr});
                    } else {
                        res.redirect('/visualisation');
                    }
                });

        }
    })
})

module.exports = router;
