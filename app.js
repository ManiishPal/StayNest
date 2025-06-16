const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");

const MONGO_URL = "mongodb://127.0.0.1:27017/StayNest";

main().then(() => {
    console.log("connected to databse");
}) 
.catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL); 
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) =>{
    res.send("hi , i am root");
});
/*
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
app.get("/listings", async (req, res) => {
    try {
        const allListings = await Listing.find({});
        res.render("listings/index.ejs", { allListings });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching listings");
    }
});


/*app.get("/testListing", async (req,res) =>{
    let sampleListing = new Listing({
        title: "My New Villa",
        description: "By the Beach",
        price: 1200,
        location: "Tortuga, Spain",
        country: "United Kingdom",
    });
    await sampleListing.save();
    console.log("Sample wad saved");
    res.send("successful testing");
});
*/
app.listen(8080, () => {
    console.log("server is listening to port 8080"); 
});
