const express = require("express");
const router = express.Router( { mergeParams: true});
const wrapAsyncs = require("../utils/wrapAsyncs.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

//reviews (post route inside reviews) post route
router.post("/", validateReview, wrapAsyncs (async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview); // Add the new review to the listing's reviews array
    await newReview.save(); // Save the new review to the database
    await listing.save();
    res.redirect(`/listings/${listing._id}`); // Redirect to the listing's show page
} )); 

//delete review route
router.delete("/:reviewId", wrapAsyncs(async (req,res) => {
    let { id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviewId}});
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
} ));

module.exports = router;