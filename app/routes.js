// app/routes.js
module.exports = function(app, passport) {
    var Post = require('../app/models/post');
    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        // Post.find({ approved: true }, function(err, posts) {
        //     if (err) return console.error(err);
        //     res.render('index.html', {
        //         posts : posts // get the user out of session and pass to template
        //     });
        // });
        res.render('index.html');
    });
    app.get('/posts', function(req, res) {
        Post.find({ approved: true }, function(err, posts) {
            if (err) return console.error(err);
            res.send({
                posts : posts
            });
        });
    });

    // =====================================
    // POST PAGE (with post function) ========
    // =====================================
    // app.get('/postas', function(req, res) {
    //     res.render('post.ejs'); // load the index.ejs file
    // });

    app.post('/post', function(req, res) {
        var newPost = new Post({
            title: req.body.title,
            text: req.body.text,
            approved: false
        });
        newPost.save(function(err){
            if (err) throw err;

            console.log('Post created!');
            res.redirect('/');
        });

    });


    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') }); 
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/backend', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    // app.get('/signup', function(req, res) {

    //     // render the page and pass in any flash data if it exists
    //     res.render('signup.ejs', { message: req.flash('signupMessage') });
    // });

    // process the signup form
    // app.post('/signup', passport.authenticate('local-signup', {
    //     successRedirect : '/backend', // redirect to the secure profile section
    //     failureRedirect : '/signup', // redirect back to the signup page if there is an error
    //     failureFlash : true // allow flash messages
    // }));

    // =====================================
    // BACKEND SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/backend', isLoggedIn, function(req, res) {
        Post.find({ approved: false }, function(err, posts) {
            if (err) return console.error(err);
            res.render('backend.ejs', {
                posts : posts // get the user out of session and pass to template
            });
        });
        
    });

    //Delete
    app.post('/editpost/:id', isLoggedIn, function(req, res) {
        if(req.body.text === ''){
            Post.findByIdAndRemove(req.params.id, req.body, function (err, post) {
                if (err) return next(err);
                    res.redirect('/backend');
            });
        }else{
        Post.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
            if (err) return next(err);
            post.approved = true;
            post.save();
                res.redirect('/backend');
            });
        }
    });
    //Edit all posts
    app.get('/allposts', isLoggedIn, function(req, res) {
        Post.find(function(err, posts) {
            if (err) return console.error(err);
            res.render('allposts.ejs', {
                posts : posts // get the user out of session and pass to template
            });
        });
    });

    app.post('/editallpost/:id', isLoggedIn, function(req, res) {
        if(req.body.text === ''){
            Post.findByIdAndRemove(req.params.id, req.body, function (err, post) {
                if (err) return next(err);
                    res.redirect('/allposts');
            });
        }else{
        Post.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
            if (err) return next(err);
            post.approved = true;
            post.save();
                res.redirect('/allposts');
            });
        }
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
