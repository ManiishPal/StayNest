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


const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: "64f0c1b2e4d3f8b1c8e4a1a2"})); // Replace with actual owner ID
    await Listing.insertMany(initData.data);
    console.log("Database initialized with sample data");
}

initDB();