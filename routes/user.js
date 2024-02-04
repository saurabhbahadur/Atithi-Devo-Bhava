const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { isLoggedIn, saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

//  signup route get
router.get("/signup", userController.renderSignUpForm);

// signup route post
router.post("/signup", wrapAsync(userController.signUp));


//  login route get
router.get("/login", userController.renderLoginForm);


//   login post route
router.post(
    "/login", saveRedirectUrl, passport.authenticate("local", { failureRedirect: "login", failureFlash: true, }), userController.logIn);

    // profile route
router.get("/profile/:id/", isLoggedIn,  wrapAsync(userController.userProfile));


// logout route
router.get("/logout", userController.logOut);


// home
router.get("/",  userController.home);


// profile edit route
router.get("/profile/:id/editProfile", isLoggedIn, upload.single("image"), wrapAsync(userController.editProfile));


// profile update edit route put
// router.put("/profile/:id/editProfile",isLoggedIn, upload.single("image"), wrapAsync(userController.updateProfile));
router.put("/profile/:id/editProfile",isLoggedIn, upload.single("image"), wrapAsync(userController.updateProfile));


// blogs
router.get("/blogs", isLoggedIn, userController.userBlogs);

// about
router.get("/about",  userController.about);




module.exports = router;