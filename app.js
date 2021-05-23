const express = require("express"); //importing express dependencies
const expressLayouts = require("express-ejs-layouts"); //importing express-ejs-layouts
// const mDB = require("mongoose"); //importing the mongoose dependency for mongodb
// const localStrategy = require("passport-local").Strategy; //importing the passpot-local dependency for authentication
const MongoClient = require( 'mongodb' ).MongoClient;

const app = express();

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))

// parse application/json
app.use(express.json())

app.use(expressLayouts);
app.set("view engine", "ejs");

app.use("/", require("./routes/index")); //using the routes in index.js in routes folder
app.use("/users", require("./routes/users")); //using the routes in users.js in routes folder

//creating route for the static files like css, images and videos request
app.use("/public/assets/", express.static("public/assets")); 
app.use("/public/assets/IMAGES", express.static("public/assets/IMAGES"));
app.use("/public/assets/VIDEOS", express.static("public/assets/VIDEOS"));

app.use("/uploads", express.static("uploads"));
app.use("/reports", express.static("reports"));

const PORT = process.env.PORT || 3000; //assigning port
app.listen(PORT, () =>
console.log("Server Started in port...", PORT));

//using login.js
const login = require("./login");
app.use(login);

const event = require("./event");
app.use(event);

const feedback = require("./feedback");
app.use(feedback);

//connecting to mongoDB database
// mongoose.connect("mongodb://localhost:27017/wellnessTracker", 
// {useNewUrlParser: true, useUnifiedTopology: true})
// .then(() => {
//     console.log("Connected to Database");
    
// })
// .catch(err => {
//     console.log(err);
// });
