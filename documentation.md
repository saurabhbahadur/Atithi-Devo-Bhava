<h1 align="center" >Couchsurfing</h1>

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
    
    app.get(req,res)=>{
        res.send("home page");
    }

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

## So from this we should say that we are using `MVC` framework for building our project

+ Now we have to set our few more steps to achieve `mvc` 

+ We are using three routes so we are requiring three routes  

    ```js

        const listingRouter = require("./routes/listing.js");
        const reviewRouter = require("./routes/review.js");
        const userRouter = require("./routes/user.js");

        // Router routes
        app.use("/listings", listingRouter);
        app.use("/listings/:id/reviews", reviewRouter);
        app.use("/", userRouter);
    
    ```

## Now we have to make a folder `routes` to set routes of every task , action

## We have to make one file of `middleware.js` to create our all middlewares

## One folder of `utils` for making `ExpressError.js` and `wrapAsync.js`

## Now we are going forward for making one by one all routes

<h2 align="center"> Advance Functioning of project </h2>

## Before starting every routes we have to install and create some middlewares

+ 

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
