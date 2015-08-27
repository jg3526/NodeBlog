var express = require('express');
var router = express.Router();

// Home Page
router.get('/', function(req, res, next) {
	res.render('index', {title: 'Index to your Blog'});
});

module.exports = router;