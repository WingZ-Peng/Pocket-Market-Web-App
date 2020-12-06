
import mongoose from 'mongoose';

const p_marketSchema = new mongoose.Schema({
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

const p_market = mongoose.model('p_market', p_marketSchema);

export default p_market;