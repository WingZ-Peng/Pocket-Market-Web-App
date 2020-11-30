// To text if the comment function adding later will work well

import mongoose from 'mongoose';
import pocketMarket from './models/pocketMarket';
import Comment from './models/comment';

var data =[
    {
        name: "Apple",
        image:"https://i2.wp.com/ceklog.kindel.com/wp-content/uploads/2013/02/firefox_2018-07-10_07-50-11.png",
        description:"It's meant to be eaten, not used play! "
    },
    {
        name: "Banana",
        image:"https://time.com/5730790/banana-panama-disease/",
        description:"What We Can Learn From the Near-Death of the Banana!"
    },
    {
        name: "Coke",
        image:"https://www.ajc.com/news/local/coke-widened-its-lead-versus-pepsi-cola-wars-last-year-report-says/xB7lMbJZORpRh1muuS1aqL",
        description:"Healthy or not?"
    }
    ]

//Preform to remove all PocketMarket
function seedDB(){
   pocketMarket.remove({}, function(err){
        if(!err){
            console.log("removed PocketMarket!");
        }

         //add few new datas about PocketMarket
        data.forEach(function(seed){
            pocketMarket.create(seed, function(err, pocketMarket){
                if(!err){
                    console.log("added a market");
                    //create new comment
                    Comment.create(
                        {
                            text: "Please join internet world!",
                            author: "Homer"
                        }, function(err, comment){
                            if(!err){
                                pocketMarket.comments.push(comment);
                                pocketMarket.save();
                                console.log("Created new comment");
                            }
                        });
                }
            });
        });
    }); 
}

module.exports = seedDB;
