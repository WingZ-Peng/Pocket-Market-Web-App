import mongoose from 'mongoose';

const commentSchema = mongoose.Schema( {
    text: String,
    createdAt: { type: Date, default: Date.now },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String,
        dataAdded: String
    }
});

const UserComment = mongoose.model("UserComment", commentSchema);

export default UserComment;