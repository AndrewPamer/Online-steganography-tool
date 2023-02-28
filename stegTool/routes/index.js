var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('encode', { title: 'Online Steganography Tool' });
});

module.exports = router;
