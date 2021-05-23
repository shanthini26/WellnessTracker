const expressLayouts = require("express-ejs-layouts");
const express = require("express");
var mongodb = require("mongodb").MongoClient;

var url = "mongodb://localhost:27017/WellCare";

const event = express();

event.use("/", require("./routes/index"));


//it is used to get the data (body parser can be used but here express itself is used)
event.use(express.urlencoded({extended: false}));

event.use(express.json()); //made for testing


const fs = require("fs");

const path = require("path");

const multer = require("multer");

var error = [];

//for photo upload initialising multer

const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, "./uploads");
	},
	filename: function(req, file, cb){
		cb(null, file.originalname);
	}
});

const filefilter = function(req, file, cb) {
	if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
		cb(null, true);
	}else{
        error.push({msg: "File limit exceeded"});
        res.render("Events", {errors: error});
		cb(new Error('File limit exceeded!!'), false);
	}
};

const upload = multer({
	storage: storage,
	limits: {
		fileSize: 1024 * 1024 * 5 //5MB limit in bytes
	},
	fileFilter: filefilter
 });


//for report upload initialising multer

const storageReport = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, "./reports");
	},
	filename: function(req, file, cb){
		cb(null, file.originalname);
	}
});

const uploadReport = multer({
    storage: storageReport,
	limits: {
		fileSize: 1024 * 1024 * 20 //20MB limit in bytes
	}
});


mongodb.connect(url, {useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
	if(err){
		console.log("Database not connected...Error occured");
	}
	else{

        var db = client.db("WellCare");

        //adding future event

        event.post("/events", (req, res, next) => {

			var newEvent = req.body;
			
			db.collection("futureEvents").insertOne(newEvent, (err, result) =>{
				res.redirect("/events");
			});
			
		});


        //uploading photo

        event.post("/uploadPhoto", upload.array('galleryphoto', 10), (req, res, next) => {

            if(!req.files){
                error.push({msg: "Please Upload File"});
                res.render("Events", {errors: error});
            }
            else{
                var images = req.files;
                var imgPaths = [];
                var encoded_img = [];
                var img, enc_img;
                var i = 0;

                images.forEach(function(file, index, arr){

                    img = fs.readFileSync(file.path);
                    enc_img = img.toString("base64");
                    imgPaths[i] = file.path;
                    encoded_img[i] = new Buffer.from(enc_img, "base64");
                    i = i + 1;
                    
                });     

                const newPhoto = {
                    name: req.body.photoeventname,
                    date: req.body.date,
                    description: req.body.eventdes,
                    path: imgPaths,
                    image: encoded_img
                };


                db.collection("gallery").insertOne(newPhoto, (err, result) =>{
                    if(err){
                        console.log("error while inserting into db");
                    }
                    res.redirect("/events");
                });
            

            }
            
        });


        //uploading report


        event.post("/uploadReport", uploadReport.single('report'), (req, res, next) => {

            if(!req.files){
                error.push({msg: "Please Upload File"});
                res.render("Events", {errors: error});
            }
            else{
    
                    var rep = fs.readFileSync(req.file.path);
                    var encoded_report = rep.toString("base64");
    
                    const newReport = {
                        name: req.body.pasteventname,
                        date: req.body.date,
                        path: req.file.path,
                        report: new Buffer.from(encoded_report, "base64")
                    };
    
                    db.collection("pastEvents").insertOne(newReport, (err, result) =>{
                        if(err){
                            console.log("error while inserting into db");
                        }
                        res.redirect("/events");
                    });
                
    
                }
                
            });

    }
});
module.exports = event;