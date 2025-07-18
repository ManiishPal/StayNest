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
            default: "https://images.unsplash.com/photo-1608463163741-a46b199d95cf?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            set: (v) => v === "" ? "https://images.unsplash.com/photo-1664523561450-e66ef2ffeecc?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v,
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