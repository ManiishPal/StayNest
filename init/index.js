const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/StayNest";

main()
    .then(() => {
        console.log("Connected to database");
        return initDB();
    })
    
    .catch((err) => {
        console.error("Error:", err);
        mongoose.connection.close();
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

async function initDB() {
    await Listing.deleteMany({}); // Clear old data (optional)
    await Listing.insertMany(initData.data); // Now matches schema
    console.log("Data initialized successfully");
}