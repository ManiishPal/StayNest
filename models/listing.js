const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    image: {  // Now accepts an object
        filename: String,
        url: {
            type: String,
            default: "https://media.istockphoto.com/id/1322245598/vector/https://images.unsplash.com/photo-1693956965359-f6bfdf022d9f?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D-404-web-page-concept-pit-stairs-traffic-cones-and-warning-sign.jpg?s=2048x2048&w=is&k=20&c=Wk-RsiTdEe7PR9i9NsMMiXS9c5riqfqflrssWg2DvRU",
            set: (v) => v === "" ? "https://media.istockphoto.com/id/1322245598/vector/error-404-web-page-concept-pit-stairs-traffic-cones-and-warning-sign.jpg?s=2048x2048&w=is&k=20&c=Wk-RsiTdEe7PR9i9NsMMiXS9c5riqfqflrssWg2DvRU" : v,
        },
    },
    description: String,
    price: Number,
    location: String,
    country: String,
    reviews: [ {
        type: Schema.Types.ObjectId,
        ref: "Review",
    },
],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if(listing) {
        await Review.deleteMany({_id: {$in: listing.reviews} } );
    }
});

const Listing = mongoose.model("Listing", listingSchema); 
module.exports = Listing;