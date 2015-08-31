var express = require('express');
var router = express.Router();

router.get('/show/:category', function(req, res, next) {
	var posts = req.db.get('posts');
	console.log(req.params.category);
	posts.find({ 'category': req.params.category }, {sort: {date: -1}}, function(err, posts) {
		res.render('index', {
			title: req.params.category,
			posts: posts
		});
	});

})
router.get('/add', function(req, res, next) {
	res.render('addcategory', {
		title: 'Add Category'
	});
});

router.post('/add', function(req, res, next) {
	console.log(req.body);
	var title = req.body.title;
	req.checkBody('title', 'Title field is required.').notEmpty();

	var errors = req.validationErrors();
	if (errors) {
		res.render('addcategory', {title:'Add Category', errors: errors});
	} else {
		var categories = req.db.get('categories');
		categories.insert({title: title}, function (err, categories) {
			if (err) {
				res.send('There was an issue submitting the category.');
			} else {
				req.flash('success', 'A new category added.');
				res.location('/');
				res.redirect('/');
			}
		});
	}
});

module.exports = router;