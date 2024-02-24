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
    return;
};


//  profile route controller
module.exports.userProfile = (req, res) => {
    res.render("users/profile.ejs", { user: req.user });
};

// userController.js

// editProfile controller get
module.exports.editProfile = async (req, res) => {
    console.log("Edit Profile Controller reached");
    try {
        let { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            req.flash("error", "This page is not available");
            res.redirect("/listings");
        }
         // Check if profileImage is present in the user object
         let originalProfileUrl = user.profileImage ? user.profileImage.url : null;

         if (originalProfileUrl) {
             // Modify the URL if needed
             originalProfileUrl = originalProfileUrl.replace("/upload", "/upload/w_250");
         }
        res.render("users/editProfile.ejs", { user ,originalProfileUrl });
    } catch (error) {
        console.error(error);
        req.flash("error", "Error loading profile");
        res.redirect("/listings");
    }
};

// updateProfile controller put
module.exports.updateProfile = async (req, res) => {
    console.log("Update Profile Controller reached");
    try {
        let { id } = req.params;
        const updatedUserData = req.body;

        // Update user data
        await User.findByIdAndUpdate(id, { $set: updatedUserData });

        // Handle profile image update
        if (req.file) {
            let url = req.file.path;
            let filename = req.file.filename;

            // Update the profileImage field
            await User.findByIdAndUpdate(id, { 
                profileImage: { url, filename } 
            });
        }

        req.flash("success", "Profile Updated!");
        res.redirect(`/profile/${id}`);
    } catch (error) {
        console.error(error);
        req.flash("error", "Error updating profile");
        res.redirect(`/profile/${id}`);
    }
};


// home controller
module.exports.home = (req, res) => {
    res.render("users/home.ejs");
};


//  about route controller
module.exports.about = (req, res) => {
    res.render("users/about.ejs");
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