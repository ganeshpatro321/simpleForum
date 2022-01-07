const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    createdAt: {type: Date, requried: true},
    content: String,
    userId: {type: mongoose.ObjectId, required: true},
    likecount: Number,
    username: {type: String, required: true}
});

PostSchema.methods.modifyPoints = (id, val) => {
    this.findByIdAndUpdate(id, {$inc : {likecount: val}});
}

const Post = mongoose.model('Post', PostSchema);
module.exports = Post;