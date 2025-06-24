const express = require("express");
const app = express();
const mongoose = require("mongoose");
const wrapAsyncs = require("./utils/wrapAsyncs.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const Review = require("./models/review.js");
const session = require("express-session");
const flash = require("connect-flash");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

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

const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, //7 days
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true, // Helps prevent XSS attacks
    },
};

// Root route
app.get("/", (req, res) => {
    res.send("hi , i am root");
});


app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});




app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);


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
