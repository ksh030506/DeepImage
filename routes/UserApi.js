var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.send('김사연');
})


module.exports = router;