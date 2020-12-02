import mongoose from 'mongoose';
import localPassportMongoose from 'passport-local-mongoose';

const UserSchema = new mongoose.Schema( {
    username: String,
    password: String,
    firstname: String,
    lastname: String,
    email: String,
});

UserSchema.plugin(localPassportMongoose);
const User = mongoose.model('User', UserSchema);

export default User;
