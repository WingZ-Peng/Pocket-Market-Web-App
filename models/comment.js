import mongoose from 'mongoose';

const commentSchema = mongoose.Schema( {
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String,
        dataAdded: String
    }
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;