
const csvtojson = require("csvtojson")
const mongoose = require("mongoose");

const drillsModel = require("../models/drills-model");
const categoriesModel = require('../models/categories-model');
const athleteModel = require('../models/athlete-model');
const DifficultyLevelModel = require("../models/difficultiesLevel-model");
const config = require("../config");


mongoose.Promise = global.Promise;
mongoose.set("useCreateIndex", true);
mongoose.connect(config.mongooseUriString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  }).then(()=>{
  
  
csvtojson().fromFile("drills.csv").then(csvData=>{
    csvData.map(async data=>{
        const path="https://proelitebuc.s3.amazonaws.com/drills/thumnails/images/"
        let body = {
            name:data["Drill"],
            thumbnail:path+data["Thumbnail"]
        }
        const athletename = data["Athlete"]
        const categoryname = data["Category"]
        const difficultyname = data["Difficulty"]
        try {
            const ath=await athleteModel.findOne({name:athletename})
            const cat=await categoriesModel.findOne({name:categoryname})
            const diff=await DifficultyLevelModel.findOne({name:difficultyname})
            body.athlete=ath._id
            body.category=cat._id
            body.difficultyLevel=diff._id
            //console.log(ath._id);
            
        } catch (error) {
            console.log(error)
        }
        console.log(body)

        try {
            await drillsModel.create(body);
    
            
        } catch (error) {
            console.log(error)
        }
      
     
    })})

});
  