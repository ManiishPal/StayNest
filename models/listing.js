const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
});

const Listing = mongoose.model("Listing", listingSchema); 
module.exports = Listing;