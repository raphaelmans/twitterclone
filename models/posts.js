var mongoose = require("mongoose");
const imageSchema = require('./image');





var postSchema = new mongoose.Schema({
    title: String,
    content: String,
    image: String,
    dateCreated:{type: Date, default: Date.now},
    author:{
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username: String
    },
    comments:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});


module.exports = mongoose.model("Post",postSchema);