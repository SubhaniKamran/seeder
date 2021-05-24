
const csvtojson = require("csvtojson")
const mongoose = require("mongoose");

const playlistModel = require("../models/playlist-model");
const categoriesModel = require('../models/categories-model');
const athleteModel = require('../models/athlete-model');
const config = require("../config");


mongoose.Promise = global.Promise;
mongoose.set("useCreateIndex", true);
mongoose.connect(config.mongooseUriString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  }).then(()=>{
  
  
csvtojson().fromFile("workouts.csv").then(csvData=>{
    csvData.map(async data=>{
        const path="https://proelitebuc.s3.amazonaws.com/playlists/images/"
        let body = {
            name:data["Workout Name"],
            description:data["Description"],
            thumbnail:path+data["Thumbnail"]
        }
        const athletename = data["Athlete"]
        const categoryname = data["Category"]
        try {
            const ath=await athleteModel.findOne({name:athletename})
            const cat=await categoriesModel.findOne({name:categoryname})
            body.athlete=ath._id
            body.category=cat._id
            //console.log(ath._id);
            
        } catch (error) {
            console.log(error)
        }
        console.log(body)

        try {
            await playlistModel.create(body);
    
            
        } catch (error) {
            console.log(error)
        }
      
     
    })})

});
  