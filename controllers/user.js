const User = require("../models/user.js");
const passport = require("passport");


// signup route get
module.exports.renderSignUpForm = (req, res) => {
    res.render("users/signup.ejs");
};

// signup route post

module.exports.signUp = async (req, res) => {
    try {
        let { email, username, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Your account is created successfullyt");
            res.redirect("/listings");
        })
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

//  profile route controller
module.exports.userProfile = (req, res) => {
    res.render("users/profile.ejs", { user: req.user });
};

//  blog route controller
module.exports.userBlogs = (req, res) => {
    res.render("users/blogs.ejs", { user: req.user });
};

// home controller
module.exports.home = (req, res) => {
    res.render("users/home.ejs");
};

//  about route controller
module.exports.about = (req, res) => {
    res.render("users/about.ejs");
};

// login get 

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};


//  login route post

module.exports.logIn = async (req, res) => {
    console.log("Login route handler executed");
    console.log(passport.authenticate);
    req.flash("success", "Welcome to wanderlust");
    let redirectUrl = res.locals.redirectUrl || "/profile/" + req.user._id;
    res.redirect(redirectUrl);
};


// logout route
module.exports.logOut = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out");
        res.redirect("/listings");
    });
};