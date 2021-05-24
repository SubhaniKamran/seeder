
const csvtojson = require("csvtojson")
const mongoose = require("mongoose");

const drillsModel = require("../models/drills-model");
const config = require("../config");
const speedModel = require("../models/speedLevel-model");


mongoose.Promise = global.Promise;
mongoose.set("useCreateIndex", true);
mongoose.connect(config.mongooseUriString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  }).then(()=>{
  
  
csvtojson().fromFile("videosdata.csv").then(csvData=>{
    csvData.map(async data=>{
        const pathimg="https://proelitebuc.s3.amazonaws.com/drills/videos/thumnails/images/"
        const pathvid="https://proelitebuc.s3.amazonaws.com/drills/videos/video-files/"
        let body = {
            thumbnail:pathimg+data["Thumbnail"],
            video:pathvid+data["Filename"],
            bpm:data["BPM"],
            duration:data["duration"]
        }
        const drillname = data["Drill"]
        const level = data["Level"]
        try {
            //const ath=await drillsModel.findOne({name:drillname})
            const speed=await speedModel.findOne({name:level})
            body.speedLevel=speed._id
          //  body.category=cat._id
           // body.difficultyLevel=diff._id
            //console.log(ath._id);
            
        } catch (error) {
            console.log(error)
        }
        console.log(body)

        try {
           await drillsModel.findOneAndUpdate(
                { name: drillname }, 
                { $push: { videos: body } }
            );
       //     await drillsModel.create(body);
    
            
        } catch (error) {
            console.log(error)
        }
      
     
    })})

});
  