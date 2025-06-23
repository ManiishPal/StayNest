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
            default: "https://media.istockphoto.com/id/1322245598/vector/error-404-web-page-concept-pit-stairs-traffic-cones-and-warning-sign.jpg?s=2048x2048&w=is&k=20&c=Wk-RsiTdEe7PR9i9NsMMiXS9c5riqfqflrssWg2DvRU",
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
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if(listing) {
        await Review.deleteMany({_id: {$in: listing.reviews} } );
    }
});

const Listing = mongoose.model("Listing", listingSchema); 
module.exports = Listing;