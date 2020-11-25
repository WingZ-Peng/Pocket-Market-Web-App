import mongoose from 'mongoose';

const userSchema = new mongoose.Schema( {
    username: String,
    password: String,
    firstname: String,
    lastname: String,
    email: String,
});

const UserInformation = mongoose.model('UserInformation', userSchema);

export default UserInformation;
