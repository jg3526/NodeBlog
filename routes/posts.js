var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: 'public/images/uploads/'}); //-> right

router.get('/show/:id', function(req, res, next) {
	var posts = req.db.get('posts');
	var id = req.params.id;
	posts.findById(id, function(err, post) {
		res.render('show', {
			title: post.title,
			post: post
		});
	});
})
router.post('/addcomment', function(req, res, next) {
	// get form values
	console.log(req.body);
	var name = req.body.name;
	var email = req.body.email;
	var body = req.body.body;
	var postid = req.body.postid;	// coming from the hidden field
	var date = new Date();

	// validation for fields
	req.checkBody('name', 'Name field is required.').notEmpty();
	req.checkBody('email', 'Email field is required.').notEmpty();
	req.checkBody('email', 'Email is not int right format.').isEmail();
	req.checkBody('body', 'Comment body is required.').notEmpty();

	var errors = req.validationErrors();
	if (errors) {
		var posts = req.db.get('posts');
		posts.findById(postid, function(err, post) {
			res.render('show', {
				title: post.title,
				post: post,
				errors: errors
			});
		});
	} else {
		var comment = {
			"name": name,
			"email": email,
			"body": body,
			"date": date
		};
		var posts = req.db.get('posts');
		posts.update({_id: postid}, {
			$push: {
				"comments": comment
			}
		}, function (err, doc){
			if (err) {
				res.send('There was an issue submitting the comment.');
			} else {
				req.flash('success', 'Comment Added.');
				res.location('/posts/show/' + postid);
				res.redirect('/posts/show/' + postid);
			}
		});
	}
});
router.get('/add', function(req, res, next) {
	var categories = req.db.get('categories');
	categories.find({},{}, function(err, categories) {
		res.render('addpost', {
			title: 'Add Post',
			categories: categories
		});
	});
});
// notice that the name 'mainimage' in the upload.single() function should be 
// the same as the name in the input file
router.post('/add', upload.single('mainimage'), function(req, res, next) {
	// get form values
	console.log(req.body);
	var title = req.body.title;
	var category = req.body.category;
	var body = req.body.body;
	var author = req.body.author;
	var date = new Date();

	console.log(req.file);
	// check for image
	if (req.file) {
		var originalName = req.file.originalname;
		var imageName = req.file.filename;
		var mime = req.file.mimetype;
		var path = req.file.path;
		var size = req.file.size;
	} else {
		var imageName = 'noimage.jpeg';
	}

	// validation for fields
	req.checkBody('title', 'Title field is required.').notEmpty();
	req.checkBody('body', 'Body field is required.').notEmpty();

	var errors = req.validationErrors();
	if (errors) {
		var categories = req.db.get('categories');
		categories.find({},{}, function(err, categories) {
			res.render('addpost', {
				title: 'Add Post',
				categories: categories,
				errors: errors
			});
		});
	} else {
		var posts = req.db.get('posts');
		posts.insert({
			title: title,
			body: body,
			author: author,
			category: category,
			date: date,
			image: imageName
		}, function (err, post){
			if (err) {
				res.send('There was an issue submitting the post.');
			} else {
				req.flash('success', 'Post submitted.');
				res.location('/');
				res.redirect('/');
			}
		});
	}
});
module.exports = router;