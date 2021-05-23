const expressLayouts = require("express-ejs-layouts");
const express = require("express");
var mongodb = require("mongodb").MongoClient;

const feedback = express();

feedback.use("/", require("./routes/index"));

feedback.use(express.urlencoded({extended: false}));

feedback.use(express.json()); //made for testing

var mongoclient = mongodb.MongoClient;

var url = "mongodb://localhost:27017/WellCare";

mongodb.connect(url, {useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
	if(err){
		console.log("Database not connected...Error occured");
	}
	else{

        var db = client.db("WellCare");
        feedback.post("/assessmentForm", (req, res, next) => {

            var newAssessment = req.body;
			
			db.collection("assessmentForms").insertOne(newAssessment, (err, result) =>{
				res.redirect("/assessmentForm");
			});
			
		});


        feedback.post("/addassessmentForm", (req, res, next) => {

            var newEvent = req.body;
			
			db.collection("feedbackForms").insertOne(newEvent, (err, result) =>{
				res.redirect("/assessmentForm");
			});
			
		});

    }
});
module.exports = feedback;