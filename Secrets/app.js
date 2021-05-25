require("dotenv").config()
const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")
const session = require("express-session")
const passport = require("passport")
const ppLocalMongoose = require("passport-local-mongoose")

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", 'ejs');

app.use(session({
    secret: "this is secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost/userDB", { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.set('useCreateIndex', true);
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});
userSchema.plugin(ppLocalMongoose);

const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function (req, res) {
    res.render("home");
});

app.get("/login", function (req, res) {
    res.render("login");
});
app.post("/login", function (req, res) {
    const user = {
        username: req.body.username,
        password: req.body.password
    }
    req.login(user, function (err) {
        if (!err) {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/secrets");
            });
        }else{
            console.log(err)
        }
    });
});

app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});

app.get("/secrets", function (req, res) {
    if (req.isAuthenticated()) {
        res.render("secrets");
    } else {
        res.redirect("/login")
    }
})

app.route("/register")
    .get(function (req, res) {
        res.render("register");
    })
    .post(function (req, res) {
        User.register({ username: req.body.username }, req.body.password, function (err, user) {
            if (err) 
            res.redirect("/register");

             passport.authenticate("local")(req, res, function () {
                res.redirect("/secrets");
            })
        })
    });

app.listen(3000, function () {
    console.log("Server running at port 3000");
}); 