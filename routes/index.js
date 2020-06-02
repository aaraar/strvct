const express = require('express');
const router = express.Router();
const request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {
  request.get('http://dev.verinote.net:4000/app/getentities', (err, response, body) => {
    if(response) {
      try {
        body = JSON.parse ( body );
      } catch ( e ) {
        console.error ( e );
      }
      if ( body.length > 0) {
        res.render ( 'index', { title: 'STRVCT', data: body } );
      } else {
        res.render ( 'upload', { title: 'STRVCT' } );
      }
    } else {
      res.render('error', {title: 'STRVCT', err});
    }
  });
});

module.exports = router;
