const expressLayouts = require("express-ejs-layouts");
const express = require("express");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const session  = require("express-session");
const user = require("./models/loginAdmin");
var mongodb = require("mongodb").MongoClient;

const path = require("path");

const login = express();


login.use("/", require("./routes/index"));
login.use("/users", require("./routes/users"));

//default middlewares needed starts here (these simply help and assist)

//setting the view engine (here we use ejs that is express layouts but hbs express-handlebars can also be used)
login.use(expressLayouts);
login.set("view engine", "ejs");

//creating a express session with some variables
login.use(session({
    secret: "settingsecret", //secret: env.secret can also be given
    resave: false,
    saveUninitialized: false
}));

//it is used to get the data (body parser can be used but here express itself is used)
login.use(express.urlencoded({extended: false}));

login.use(express.json()); //made for testing

var url = "mongodb://localhost:27017/WellCare";


var db;

mongodb.connect(url, {useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
	if(err){
		console.log("Database not connected...Error occured");
	}
	else{
		console.log("Connected to database");

		db = client.db("WellCare");
		var errors;

		login.post("/login", (req, res, next) => {

			var form_username = req.body.username;
			var form_password = req.body.password;

			errors = [];

			db.collection("login").findOne({"username": form_username, "password": form_password}, (err, user) => {
				
				if(user != null){
                    res.redirect("/dashboard");
				}else{
					errors.push({msg: "Username or Password Invalid"});
					console.log("Username or Password Invalid");

					if(errors.length > 0){
						
						res.render("LoginAdmin", {error: errors});
					}

				}

			});

			
		});



	}
});

module.exports = login;
