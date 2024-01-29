const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { isLoggedIn, saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");


//  signup route get
router.get("/signup", userController.renderSignUpForm);

// signup route post
router.post("/signup", wrapAsync(userController.signUp));

// home
router.get("/",  userController.home);

// profile 
router.get("/profile/:id", isLoggedIn, userController.userProfile);

// blogs
router.get("/blogs", isLoggedIn, userController.userBlogs);

// about
router.get("/about",  userController.about);


//  login route get
router.get("/login", userController.renderLoginForm);


//   login post route
router.post(
    "/login", saveRedirectUrl, passport.authenticate("local", { failureRedirect: "login", failureFlash: true, }), userController.logIn);


// logout route
router.get("/logout", userController.logOut);


module.exports = router;