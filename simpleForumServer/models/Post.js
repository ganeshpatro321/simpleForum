const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: String,
    description: String,
    createdAt: Date,
    content: String,
    userId: mongoose.ObjectId,
    likecount: Number
});

PostSchema.methods.modifyPoints = (id, val) => {
    this.findByIdAndUpdate(id, {$inc : {likecount: val}});
}

const Post = mongoose.model('Post', PostSchema);
module.exports = Post;