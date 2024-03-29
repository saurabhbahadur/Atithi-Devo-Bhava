const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


// Index controller 
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

// new controller form for create
module.exports.renderNewListingForm = (req, res) => {
    res.render("listings/new.ejs");
};

// Show controller READ operation
module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: { path: "author", },
        })
        .populate("owner");

    res.render("listings/show.ejs", { listing });
};

// create listing controller
module.exports.createNewListing = async (req, res, next) => {

    let coordinate = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
    })
        .send()

        

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

// update controller
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let coordinate = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
    })
        .send()

    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

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

// delete controller
module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleated!");
    res.redirect("/listings");
};