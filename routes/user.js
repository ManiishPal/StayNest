const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsyncs = require("../utils/wrapAsyncs.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

router.post("/signup", wrapAsyncs(async (req, res) => {
    try {
        let { email, username, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Welcome to the app!");
    res.redirect("/listings");
    });
    
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup"); 
    }
}));

router.get("/login", (req, res) => {
    res.render("users/login.ejs");
    });

router.post("/login", saveRedirectUrl, passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }), async (req, res, next) => {
        req.flash("success", "Logged in successfully!");
        let redirectUrl = res.locals.redirectUrl || "/listings"; // Use the saved redirect URL or default to /listings
        res.redirect(redirectUrl);  
});

router.get("/logout", (req, res, next) => { 
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "you have logged out successfully!");
        res.redirect("/listings");
    })
});

module.exports = router;