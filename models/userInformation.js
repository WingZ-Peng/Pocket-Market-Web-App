import mongoose from 'mongoose';
import localPassportMongoose from 'passport-local-mongoose';

const userSchema = new mongoose.Schema( {
    username: String,
    password: String,
    firstname: String,
    lastname: String,
    email: String,
    isAdmin: { type: Boolean, default: false}
});

UserSchema.plugin(localPassportMongoose);
const UserInformation = mongoose.model('UserInformation', userSchema);

export default UserInformation;
