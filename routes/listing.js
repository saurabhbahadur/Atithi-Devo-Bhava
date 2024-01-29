const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");


const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });
const Listing = require("../models/listing.js");


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