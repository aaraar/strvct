const express = require('express');
const router = express.Router();
const multer  = require('multer')
const upload = multer();
const request = require('request');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/upload', upload.single('dataset'), (req,res) => {
  let formData = {
    contentType: 'multipart/form-data',
    //file field need set options 'contentType' and 'filename' for formData
    'file':{
      value:req.file.buffer,
      options:{
        contentType:req.file.mimetype,
        filename:req.file.originalname
      }
    }
  };
  request.post({
    url:'http://dev.verinote.net:4000/app/uploadvocabulary',
    formData
  },function(err,response,body){
    if (err) {
      console.log(err);
      res.render('error', {title: 'STRVCT', err});
    } else {
      res.render('index', {title: 'STRVCT'});
    }
  });
});

module.exports = router;
