import mongoose from 'mongoose';
import localPassportMongoose from 'passport-local-mongoose';

const userSchema = new mongoose.Schema( {
    username: String,
    password: String,
    avatar: String,
    firstname: String,
    lastname: String,
    email: String,
    isAdmin: { type: Boolean, default: false}
});

UserSchema.plugin(localPassportMongoose);
var UserInformation = mongoose.model('UserInformation', userSchema);

export default UserInformation;
