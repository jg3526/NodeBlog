var express = require('express');
var router = express.Router();

// Homepage Blog Posts
router.get('/', function(req, res, next) {
	var db = req.db;
	var posts = db.get('posts');
	posts.find({},{sort: {date: -1}}, function(err, posts) {
		res.render('index', {
			title: 'Node Blog',
			posts: posts
		});
	});
});

module.exports = router;