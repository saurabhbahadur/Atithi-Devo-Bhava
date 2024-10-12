<h1 align="center" >Atithi Devo Bhava</h1>

# Introduction


### Dependencies we are using

```json
"dependencies": {
    "@mapbox/mapbox-sdk": "^0.15.3",
    "cloudinary": "^1.41.3",
    "connect-flash": "^0.1.1",
    "connect-mongo": "^5.1.0",
    "dotenv": "^16.3.2",
    "ejs": "^3.1.9",
    "ejs-mate": "^4.0.0",
    "express": "^4.18.2",
    "express-session": "^1.17.3",
    "joi": "^17.12.0",
    "method-override": "^3.0.0",
    "mongoose": "^8.0.3",
    "multer": "^1.4.5-lts.1",
    "multer-storage-cloudinary": "^4.0.0",
    "passport": "^0.7.0",
    "passport-local": "^1.0.0",
    "passport-local-mongoose": "^8.0.0"
  }

```

***


<h2 align="center"> Starter of any project </h2>

## For starting this project first we have to make a  server to run this project


+ Install `express` in your project folder

    ```
    npm i express
    ```
+ create `app.js` and write your server code

+ then create express server

    ```js
    const express = require("express");
    const app = express();
    
    app.get((req,res)=>{
        res.send("home page");
    })

    app.listen(3000, () => {
    console.log("Server is starting......");
    });

    ```
+ After, this  Go to browser and paste url:

    ```
    localhost:3000
    ```

## Now we have to set ejs engine :

+ So, you have to install `ejs` and `ejs-mate`

    ```
    npm i ejs
    ```
     ```
    npm i ejs-mate
    ```
+ Now you have to set `view engine` path for ejs

    ```js
    const path = require("path");
    const ejsMate = require("ejs-mate");

    app.set("view engine", "ejs");
    app.engine('ejs', ejsMate);
    app.set("views", path.join(__dirname, "views"));
    
    ```
+ create folder of `views` to make all your `ejs-template` in one folder

## As we already set our path for ejs so now we have to set path for our `css` and `js` files 

+ First we have to make a folder of `public`

+ and two sub-folder of `css` and `js`

+ then set the path for these folder

    ```js

    app.use(express.static(path.join(__dirname, "/public")));

    ```

## Now we have to use `method-override` middleware to use  URL-encoded payloads.

+ First to install `method-override`

    ```
    npm i method-override
    ```
+ Now use this built-in middleware

    ```js
    const methodOverride = require("method-override");
    app.use(express.urlencoded({ extended: true }));
    app.use(methodOverride("_method"));
    
    ```

## And one most important thing we have to do `Database Connectivity` we are using `Mongo DB` so steps are:

+ We have to install `mongoose`

    ```
    npm i mongoose
    ```
+ Now, we have to make `connection` to database

    ```js
    
    const mongoose = require("mongoose");

    //  mongo connectivity

     const MONGO_URL = "mongodb://127.0.0.1:27017/YOUR_DATABASE_NAME";


    main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    })

    async function main() {
        await mongoose.connect(MONGO_URL);
    }
    
    ```
+ We make separate folder of `models` for making mongo models

<h2 align="center"> Basic Functioning of  project </h2>

## Now from here we know that we are already using `models` and `views` , So now one more folder we have to create `controllers` for controlling everything.

## So from this we should say that we are using `MVC` architecture for building our project

+ Now we have to set our few more steps to achieve `mvc` 

+ We are using three routes so we are requiring three routes  

    ```js
        const listingRouter = require("./routes/listing.js");
        const reviewRouter = require("./routes/review.js");
        const userRouter = require("./routes/user.js");
        const blogRouter = require("./routes/blogRoutes.js");
        // Router routes
        app.use("/listings", listingRouter);
        app.use("/listings/:id/reviews", reviewRouter);
        app.use("/", userRouter);
        app.use("/blogs", blogRouter);

    ```

## Now we have to make a folder `routes` to set routes of every task , action

## We have to make one file of `middleware.js` to create our all middlewares

## One folder of `utils` for making `ExpressError.js` and `wrapAsync.js`

## Now we are going forward for making one by one all routes

---

<h2 align="center"> Advance Functioning of project </h2>

---
## Before starting every routes we have to install and create some middlewares

# Middlewares

+ Requirements

    ```js
    const Listing = require("./models/listing.js");
    const Review = require("./models/review.js");
    const { listingSchema, reviewSchema } = require("./schema.js");
    const ExpressError = require("./utils/ExpressError.js");

    ```
+ Login Middleware

    ```js
        module.exports.isLoggedIn = (req, res, next) => {
    

    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must logged in to create listing");
       return res.redirect("/login");
        
    }
    next();
    };
    ```

+ Redirect url Middleware

    ```js
    module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        return res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
    };
    ```

+ Owner Middleware

    ```js
        module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
    };

    ```
+ Validate Listing Middleware

    ```js
        module.exports.validateListing = (req, res, next) => {
    
    let { error } = listingSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
    };

    ```

+ Validate Review Middleware

    ```js
        module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
    };
    ```
+ Review Owner Middleware

    ```js
        // Review Owner
    module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
    };

    ```
 
# Utils

+ ## Express Error 

    ```js
    class ExpressError extends Error {
    constructor(statusCode, message) {
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
    }

    module.exports = ExpressError;
    ```
+ ## WrapAsync 

    ```js
        module.exports = (fn) => {
        return (req, res, next) => {
        fn(req, res, next).catch(next);
         }
        }
    ```

# Setting routes for listings

+ ##  Controllers for listing

    + #### Requirements 

    ```js
    const Listing = require("../models/listing.js");
    const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
    const mapToken = process.env.MAP_TOKEN;
    const geocodingClient = mbxGeocoding({ accessToken: mapToken });

    
    ```

    + ### Index Route

        ```js
        // Index controller 
        module.exports.index = async (req, res) => {
            const allListings = await Listing.find({});
            res.render("listings/index.ejs", { allListings });
        };
        
        ```
    + ### Create Route (Rendering new form) Operation GET 

        ```js
        // new controller form for create
        module.exports.renderNewListingForm = (req, res) => {
            res.render("listings/new.ejs");
        };
        
        ```
        + ### Create Route Operation POST

            ```js
            // create listing controller
            module.exports.createNewListing = async (req, res, next) => {

                let coordinate = await geocodingClient.forwardGeocode({
                query: req.body.listing.location,
                limit: 1,
                })
                .send()

                console.log(coordinate.body.features[0].geometry);

                let url = req.file.path;
                let filename = req.file.filename;
                // console.log(url, "..", filename);
                 const newListing = new Listing(req.body.listing);
                  newListing.owner = req.user._id;
                 newListing.image = { url, filename };
                 newListing.geometry = coordinate.body.features[0].geometry;
                 await newListing.save();
                 req.flash("success", "New Listing Created!");
                res.redirect("/listings");
            };
            
            ```
    + ### Read Route Operation

        ```js
        
        // Show controller READ operation
            module.exports.showListing = async (req, res) => {
            let { id } = req.params;
            const listing = await Listing.findById(id)
                .populate({
                path: "reviews",
                populate: { path: "author", },
            })
            .populate("owner");
            console.log(listing);
            res.render("listings/show.ejs", { listing });
            };

        ```
    
    + ### Update Route (Rendering Edit form) Operation GET

        ```js
            // edit controller
            module.exports.editListing = async (req, res) => {
                let { id } = req.params;
                const listing = await Listing.findById(id);
                if (!listing) {
                 req.flash("error", "This page is not available");
                    res.redirect("/listings");
                }
                let originalImageUrl = listing.image.url;
                originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
                res.render("listings/edit.ejs", { listing, originalImageUrl });
            };
        
        ```

        + ### Update Route Operation POST

            ```js
            // update controller
                module.exports.updateListing = async (req, res) => {

                let { id } = req.params;
                let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

                let coordinate = await geocodingClient.forwardGeocode({
                : req.body.listing.location,
                limit: 1,
                })
                    .send()

                if (typeof req.file !== "undefined") {
                    let url = req.file.path;
                    let filename = req.file.filename;
                    listing.image = { url, filename };
                    listing.geometry = coordinate.body.features[0].geometry;
                    await listing.save();
                }

                req.flash("success", " Listing Updated!");
                res.redirect(`/listings/${id}`);
                };
            
            ```
    + ## Delete Route Operation

        ```js
        // delete controller
        module.exports.deleteListing = async (req, res) => {
        let { id } = req.params;
        let deletedListing = await Listing.findByIdAndDelete(id);
        console.log(deletedListing);
        req.flash("success", "Listing Deleated!");
        res.redirect("/listings");
        };
        
        ```


+ ## Routes for listings

     + #### Requirements

     ```js
        const express = require("express");
        const router = express.Router();
        const wrapAsync = require("../utils/wrapAsync.js");
        const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
        const listingController = require("../controllers/listing.js");


        const multer = require('multer');
        const { storage } = require("../cloudConfig.js");
        const upload = multer({ storage });
        const Listing = require("../models/listing.js");

     
     ```

```js
    // new route form for create
    router.get("/new", isLoggedIn, listingController.renderNewListingForm);

    router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(listingController.createNewListing));


    router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));



        // edit route
    router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListing));


    module.exports = router;
    
    ```

# Setting routes for users

+ ##  Controllers for users

    + #### Requirements 

    ```js
    const User = require("../models/user.js");
    const passport = require("passport");
    ```
    + #### Sign Up Routes

    ```js
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
    ```

    + #### Login Routes

    ```js
    // login get 

    module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
    };


    //  login route post

    module.exports.logIn = async (req, res) => {
    console.log("Login route handler executed");
    console.log(passport.authenticate);
    req.flash("success", "Welcome to Atithi Devo Bhava");
    let redirectUrl = res.locals.redirectUrl || "/profile/" + req.user._id;
    res.redirect(redirectUrl);
    return;
    };
    ```
    
    + #### Profile Routes

    ```js
    //  profile route controller
    module.exports.userProfile = (req, res) => {
    res.render("users/profile.ejs", { user: req.user });
    };
    ```
    + #### Edit Profile Routes

    ```js
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
    ```

    + #### Update Profile Routes

    ```js
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

    ```
    + #### Home Controller Route

    ```js
    // home controller
    module.exports.home = (req, res) => {
    res.render("users/home.ejs");
    };
    ```
    + #### About Controller Route

    ```js
    //  about route controller
    module.exports.about = (req, res) => {
    res.render("users/about.ejs");
    };
    ```

    + #### Logout Controller Route
    
    ```js

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
    ```
+ ## Routes for Users

     + #### Requirements

        ```js
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
        ```

        ```js
        
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
        router.put("/profile/:id/editProfile",isLoggedIn, upload.single("image"), wrapAsync(userController.updateProfile));


        // about
        router.get("/about",  userController.about);

        module.exports = router;

        ```


# Setting routes for Blog

+ ##  Controllers for blog

    + #### Requirements 

    ```js
    const { Blog, Comment } = require("../models/blog");
    ```
    + #### User Blog Route Controller

    ```js
    module.exports.userBlogs = async (req, res) => {
    try {
        const { id } = req.params;
        const currentUser = req.user;
        let posts;

        if (id) {
            // Fetch blogs for the specified user and populate the 'author' field
            posts = await Blog.find({ author: id }).populate('author').populate('comments.author');
        } else {
            // Fetch blogs from all users and populate the 'author' field
            posts = await Blog.find().populate('author').populate('comments.author');
        }

        res.render("blogs/index.ejs", { currentUser, posts }); // Pass currentUser and posts to the template
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
    };

    ```

    + #### Blog Post Route Controller

    ```js
    
    module.exports.postInBlogs = async (req, res) => {
    try {
        const { title, message } = req.body;
        
        // Find the current user
        const currentUser = req.user;
        if (!currentUser) {
            throw new Error("User not found");
        }
        
        // Create the new blog post object
        const newPost = new Blog({
            title: title,
            message: message,
            author: currentUser._id // Assuming currentUser is an instance of User model
        });
        
        // Save the new post
        await newPost.save();

        req.flash("success", "Successfully posted in blogs.");
        res.redirect('/blogs');
    } catch (err) {
        console.error(err);
        req.flash("error", "Failed to post in blogs.");
        res.redirect('/blogs');
    }
    };
    ```

    + #### Delete Blog Route Controller

    ```js
    module.exports.deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findById(id);
        console.log(blog);
        // Check if the blog post exists and if the current user is the author
        if (!blog) {
            req.flash("error", "Blog not found.");
            return res.redirect("/blogs");
        }
        if (!blog.author.equals(req.user._id)) {
            req.flash("error", "You are not authorized to delete this blog.");
            return res.redirect("/blogs");
        }

        // If the user is authorized, delete the blog post
        await Blog.findByIdAndDelete(id);
        req.flash("success", "Blog deleted successfully.");
        res.redirect("/blogs");
    } catch (error) {
        console.error("Error deleting blog:", error);
        req.flash("error", "Failed to delete blog.");
        res.redirect("/blogs");
    }
    };
    ```

    + #### Post Comment in Blog controller

    ```js
    module.exports.postComment = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findById(id);
        if (!blog) {
            req.flash("error", "Blog not found.");
            return res.redirect("/blogs");
        }

        const { text } = req.body;
        const author = req.user._id;

        const newComment = new Comment({ text, author });
        blog.comments.push(newComment);
        await blog.save();

        req.flash("success", "Comment added successfully.");
        res.redirect("/blogs");
    } catch (error) {
        console.error("Error posting comment:", error);
        req.flash("error", "Failed to add comment.");
        res.redirect("/blogs");
    }
    };
    ```
+ ## Routes for Blogs

     + #### Requirements

        ```js
            // routes/blogRoutes.js
        const express = require("express");
        const router = express.Router();
        const userController = require("../controllers/blogController");
        const { isLoggedIn } = require("../middleware");
        ```
        ```js
        router.get("/", isLoggedIn ,  userController.userBlogs);
        router.post("/", isLoggedIn , userController.postInBlogs);
        router.delete("/:id/delete", isLoggedIn,   userController.deleteBlog);
        router.post("/:id/comments", isLoggedIn, userController.postComment);

        module.exports = router;
        ```

# Setting routes for Review

+ ##  Controllers for Post Review

    + #### Requirements 

    ```js
    const Review = require("../models/review.js");
    const Listing = require("../models/listing.js");
    ```
    + #### Post Review Controller

    ```js
    // Post Route
    module.exports.postReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
   
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    console.log("New Review save");


    res.redirect(`/listings/${listing._id}`);
    };

    ```

    + #### Delete Review Controller 

    ```js
    // Delete route for review

    module.exports.deleteReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);

    };

    ```

    + ## Routes for Review

     + #### Requirements

        ```js
        const express = require("express");
        const router = express.Router({ mergeParams: true });
        const wrapAsync = require("../utils/wrapAsync.js");
        const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
        const reviewController = require("../controllers/review.js");
        ```
        ```js
            // Post Route

            router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.postReview));

        // Delete route for review

            router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview));

            module.exports = router;

        ```

# Models / Schema

+ Listing Model

    ```js

    ```

+ User Model

    ```js

    ```
+ Blog Model

    ```js

    ```
+ Review Model

    ```js

    ```

# Session 

```js

     const sessionOption = {
         store,
         secret: process.env.SECRET,
         resave: false,
         saveUninitialized: true,
         cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,  // secure from crossconnection attack
          },

          };



        app.use(session(sessionOption));
         app.use(passport.initialize());
         app.use(passport.session());


         passport.serializeUser(User.serializeUser());
          passport.deserializeUser(User.deserializeUser());

        app.use(flash());

```

# Authentication

```js
        //  local strategy
        passport.use(new LocalStrategy(User authenticate()));
```

# Cloudinary Configuration

```js

    const cloudinary = require('cloudinary').v2;
    const { CloudinaryStorage } = require('multer-storage-cloudinary');

    cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
    });

    const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'couchSurfing_DEV',
        allowedFormat: ["png", "jpg", "jpeg"],
    },
    });

    module.exports = {
    cloudinary, storage,
    };

```

# Server side Model Validation 

```js
const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().allow("", null)


    }).required()
});



module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required()
});
```

