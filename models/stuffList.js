import mongoose from 'mongoose';

const stuffSchema = new mongoose.Schema( {
    name: String,
    genre: String,
    description: String,
    price: String,
})

const stuffList = mongoose.model('stuffList', stuffSchema);

export default stuffList;