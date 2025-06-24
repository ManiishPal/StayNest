const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema ({
    email: {
        type: String,
        required: true,
    },
});

userSchema.plugin(passportLocalMongoose);  //passport local mongoose plugin adds username and password fields to the schema automatically
//hashing passwords and adding methods for authentication
//salting are also handled by this plugin
//passport-local-mongoose also adds methods to the User model for authentication, such as `authenticate`, `register`, and `serializeUser`.
//we can also choose to add google, facebook, twitter, github, etc. authentication using passport-local-mongoose
//pbkdf2 is used for hashing passwords by default, but we can change it to bcrypt or any other hashing algorithm if we want

module.exports = mongoose.model("User", userSchema);