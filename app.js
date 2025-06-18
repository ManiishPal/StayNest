const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

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
app.get("/listings", async (req, res) => {
    try {
        const allListings = await Listing.find({});
        res.render("listings/index", { allListings });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching listings");
    }
});
//new route
app.get("/listings/new", (req,res) => {
    res.render("listings/new.ejs");
});

// Show route – single listing by ID
app.get("/listings/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);
        if (!listing) {
            return res.status(404).send("Listing not found");
        }
        res.render("listings/show", { listing }); 
    } catch (err) {
        console.error(err);
        res.status(500).send("Error finding listing");
    }
});

//create route
app.post("/listings", async (req,res) => {
   // let listing = req.body.listing;
   // console.log(listing);
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});

// Edit route – show the edit form for a listing
app.get("/listings/:id/edit", async (req, res) => {
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
});
// Update route – update listing data
app.put("/listings/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        res.redirect(`/listings/${id}`); // ✅ backticks for interpolation
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating listing");
    }
});

// Delete route – remove a listing
app.delete("/listings/:id", async (req, res) => {
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
});





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

app.listen(8080, () => {
    console.log("server is listening to port 8080"); 
});
