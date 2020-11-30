import mongoose from 'mongoose';

const pocketMarketSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    cost: Number,
    location: String,
    createdAt: { type: Date, default: Date.now },
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

var PocketMarket = mongoose.model('PocketMarkrt', pocketMarketSchema);

export default PocketMarket;