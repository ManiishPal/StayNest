const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsyncs = require("./utils/wrapAsyncs.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/StayNest";

// Connect to MongoDB
main().then(() => {
    console.log("connected to databse");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL); 
}

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// Root route
app.get("/", (req, res) => {
    res.send("hi , i am root");
});

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};


/*
// COMMENTED: direct listing fetch + raw send
app.get("/listings", async (req, res) => {
    try {
        const listings = await Listing.find({});
        console.log(listings);
        res.send(listings);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching listings");
    }
});
*/

// Index route – all listings
app.get("/listings", wrapAsyncs(async (req, res) => {
    try {
        const allListings = await Listing.find({});
        res.render("listings/index", { allListings });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching listings");
    }
}));
//new route
app.get("/listings/new", (req,res) => {
    res.render("listings/new.ejs");
});

// Show route – single listing by ID
app.get("/listings/:id", wrapAsyncs(async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id).populate("reviews"); // Populate reviews to show them in the listing
        if (!listing) {
            return res.status(404).send("Listing not found");
        }
        res.render("listings/show", { listing }); 
    } catch (err) {
        console.error(err);
        res.status(500).send("Error finding listing");
    }
}));

//create route
app.post("/listings", wrapAsyncs(async ( req, res, next)  => {
   // let listing = req.body.listing;
   // console.log(listing);
    let result = listingSchema.validate(req.body);
    console.log(result);
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
    
})
);

// Edit route – show the edit form for a listing
app.get("/listings/:id/edit", wrapAsyncs(async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);
        if (!listing) {
            return res.status(404).send("Listing not found");
        }
        res.render("listings/edit", { listing }); // No leading slash and no .ejs needed
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading edit page");
    }
}));
// Update route – update listing data
app.put("/listings/:id", wrapAsyncs(async (req, res) => {
    try {
        const { id } = req.params;
        await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        res.redirect(`/listings/${id}`); // ✅ backticks for interpolation
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating listing");
    }
}));

// Delete route – remove a listing
app.delete("/listings/:id", wrapAsyncs(async (req, res) => {
    try {
        const { id } = req.params;
        const deletedListing = await Listing.findByIdAndDelete(id);
        
        if (!deletedListing) {
            return res.status(404).send("Listing not found");
        }

        console.log("Deleted listing:", deletedListing);
        res.redirect("/listings");
    } catch (err) {
        console.error("Error deleting listing:", err);
        res.status(500).send("Server error while deleting listing");
    }
}));

//reviews (post route inside reviews) post route
app.post("/listings/:id/reviews", validateReview, wrapAsyncs (async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview); // Add the new review to the listing's reviews array
    await newReview.save(); // Save the new review to the database
    await listing.save();
    res.redirect(`/listings/${listing._id}`); // Redirect to the listing's show page
} )); 

//delete review route
app.delete("/listings/:id/reviews/:reviewId", wrapAsyncs(async (req,res) => {
    let { id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviewId}});
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
} ));


/*
// COMMENTED: sample testing listing creation
app.get("/testListing", async (req, res) => {
    let sampleListing = new Listing({
        title: "My New Villa",
        description: "By the Beach",
        price: 1200,
        location: "Tortuga, Spain",
        country: "United Kingdom",
    });
    await sampleListing.save();
    console.log("Sample was saved");
    res.send("successful testing");
});
*/



app.use((err, req, res, next) => {
    res.send("something went wrong"); 
})

app.listen(8080, () => {
    console.log("server is listening to port 8080"); 
});
