var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Jaykey, Venice, Haynel');
});

module.exports = router;
