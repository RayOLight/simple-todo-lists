var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/api/auth', function (req, res) {
    res.end('success');
});

module.exports = router;
