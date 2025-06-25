const Listings = require("./models/listing.js");

const Review = require("./models/review.js");


module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl; // Store the original URL to redirect after login
        req.flash("error", "You must be logged in to create a listing");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl; // Make the redirect URL available in templates
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listings.findById(id);
    if (!listing.owner.equals(req.user._id)) {
        req.flash("error", "You are not the owner of this listing");
        return res.redirect("/listings");
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const {id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You cannot delete or edit this review");
        return res.redirect("/listings");
    }
    next();
}

