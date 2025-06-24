const express = require("express");
const router = express.Router();
const wrapAsyncs = require("../utils/wrapAsyncs.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// Index route – all listings
router.get("/", wrapAsyncs(async (req, res) => {
    try {
        const allListings = await Listing.find({});
        res.render("listings/index", { allListings });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching listings");
    }
}));
//new route
router.get("/new", (req,res) => {
    res.render("listings/new.ejs");
});

// Show route – single listing by ID
router.get("/:id", wrapAsyncs(async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id).populate("reviews"); // Populate reviews to show them in the listing
        if (!listing) {
            return res.status(404).send("Listing not found");
            req.flash("error", "Listing not found");
            res.redirect("/listings");
        }
        res.render("listings/show", { listing }); 
    } catch (err) {
        console.error(err);
        res.status(500).send("Error finding listing");
    }
}));

//create route
router.post("/", wrapAsyncs(async ( req, res, next)  => {
   // let listing = req.body.listing;
   // console.log(listing);
    let result = listingSchema.validate(req.body);
    console.log(result);
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "Successfully created a new listing!");
    res.redirect("/listings");
    
})
);

// Edit route – show the edit form for a listing
router.get("/:id/edit", wrapAsyncs(async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);
        if (!listing) {
            return res.status(404).send("Listing not found");
            req.flash("error", "Listing not found");
            res.redirect("/listings");
        }
        res.render("listings/edit", { listing }); // No leading slash and no .ejs needed
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading edit page");
    }
}));
// Update route – update listing data
router.put("/:id", wrapAsyncs(async (req, res) => {
    try {
        const { id } = req.params;
        await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        req.flash("success", "Successfully updated the listing!");
        res.redirect(`/listings/${id}`); // ✅ backticks for interpolation
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating listing");
    }
}));

// Delete route – remove a listing
router.delete("/:id", wrapAsyncs(async (req, res) => {
    try {
        const { id } = req.params;
        const deletedListing = await Listing.findByIdAndDelete(id);
        
        if (!deletedListing) {
            return res.status(404).send("Listing not found");
        }

        console.log("Deleted listing:", deletedListing);
        req.flash("success", "Successfully deleted the listing!");
         // Redirect to the listings index page after deletion
         // ✅ Use res.redirect with a string path
         // ✅ No need for leading slash in the path
         // ✅ No need for .ejs extension in the path
        res.redirect("/listings");
    } catch (err) {
        console.error("Error deleting listing:", err);
        res.status(500).send("Server error while deleting listing");
    }
}));

module.exports = router;