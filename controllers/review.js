const Review = require("../models/review.js");
const Listing = require("../models/listing.js");


// Review Route
// Post Route
module.exports.postReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    console.log("New Review save");


    res.redirect(`/listings/${listing._id}`);
};

// Delete route for review

module.exports.deleteReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);

};