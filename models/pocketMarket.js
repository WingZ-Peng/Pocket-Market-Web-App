import mongoose from 'mongoose';

const pocketMarketSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    author: {
       id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
       },
       username: String
    },
    comments: [
       {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Comment"
       }
    ] 
});

const pocketMarket = mongoose.model('pocketMarkrt', pocketMarketSchema);

export default pocketMarket;